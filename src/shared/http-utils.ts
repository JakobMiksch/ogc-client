import { parseXmlString } from './xml-utils';
import { EndpointError } from './errors';
import { decodeString } from './encoding';

const fetchPromises: Map<string, Promise<Response>> = new Map();

/**
 * Returns a promise equivalent to `fetch(url)` but guarded against
 * identical concurrent requests
 * Note: this should only be used for GET requests!
 */
export function sharedFetch(url: string, method: 'GET' | 'HEAD' = 'GET') {
  const fetchKey = `${method}#${url}`;
  if (fetchPromises.has(fetchKey)) {
    return fetchPromises.get(fetchKey);
  }
  // to avoid unhandled promise rejections this promise will never reject,
  // but only return errors as a normal value
  const promise = fetch(url, { method })
    .catch((e) => e)
    .then((resp) => {
      fetchPromises.delete(fetchKey);
      return resp;
    });
  fetchPromises.set(fetchKey, promise);
  // if an error is received then the promise will reject with it
  return promise.then((resp) => {
    if (resp instanceof Error) throw resp;
    return resp;
  });
}

/**
 * Runs a GET HTTP request to the provided URL and resolves to the
 * XmlDocument
 */
export function queryXmlDocument(url: string) {
  return sharedFetch(url)
    .catch(() =>
      // attempt a HEAD to see if the failure comes from CORS or the service is generally unreachable
      fetch(url, { method: 'HEAD', mode: 'no-cors' })
        .catch((error) => {
          throw new EndpointError(
            `Fetching the document failed either due to network errors or unreachable host, error is: ${error.message}`,
            0,
            false
          );
        })
        .then(() => {
          throw new EndpointError(
            `The document could not be fetched due to CORS limitations`,
            0,
            true
          );
        })
    )
    .then(async (resp) => {
      if (!resp.ok) {
        const text = await resp.text();
        throw new EndpointError(
          `Received an error with code ${resp.status}: ${text}`,
          resp.status,
          false
        );
      }
      const buffer = await resp.arrayBuffer();
      const contentTypeHeader = resp.headers.get('Content-Type');
      return decodeString(buffer, contentTypeHeader);
    })
    .then((xml) => parseXmlString(xml));
}

/**
 * Add or replace query params in the url; note that params are considered case-insensitive,
 * meaning that existing params in different cases will be removed as well.
 * Also, if the url ends with an encoded URL (typically in the case of urls run through a CORS
 * proxy, which is an aberration and should be forbidden btw), then the encoded URL
 * will be modified instead.
 */
export function setQueryParams(
  url: string,
  params: Record<string, string | boolean>
): string {
  const encodedUrlMatch = url.match(/(https?%3A%2F%2F[^/]+)$/);
  if (encodedUrlMatch) {
    const encodedUrl = encodedUrlMatch[1];
    const modifiedUrl = setQueryParams(decodeURIComponent(encodedUrl), params);
    return url.replace(encodedUrl, encodeURIComponent(modifiedUrl));
  }

  const urlObj = new URL(url);
  const keys = Object.keys(params);
  const keysLower = keys.map((key) => key.toLowerCase());
  const toDelete = [];
  for (const param of urlObj.searchParams.keys()) {
    if (keysLower.indexOf(param.toLowerCase()) > -1) {
      toDelete.push(param);
    }
  }
  toDelete.map((param) => urlObj.searchParams.delete(param));
  keys.forEach((key) =>
    urlObj.searchParams.set(
      key,
      params[key] === true ? '' : (params[key] as string)
    )
  );
  return urlObj.toString();
}
