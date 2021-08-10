/**
 * Generates an URL for a GetFeature operation
 * @param {string} serviceUrl
 * @param {WfsVersion} version
 * @param {string} featureType
 * @param {number} [maxFeatures] if not defined, all features will be returned
 * @param {string[]} [attributes] if not defined, all attributes will be included
 * @param {boolean} [hitsOnly] if true, will not return feature data, only hit count
 *   note: this might not work for WFS version < 2
 * @return {string}
 */
export function generateGetFeatureUrl(
  serviceUrl,
  version,
  featureType,
  maxFeatures,
  attributes,
  hitsOnly
) {
  const typeParam = version === '2.0.0' ? 'TYPENAMES' : 'TYPENAME';
  const countParam = version === '2.0.0' ? 'COUNT' : 'MAXFEATURES';
  const url = new URL(serviceUrl);
  url.searchParams.set('SERVICE', 'WFS');
  url.searchParams.set('REQUEST', 'GetFeature');
  url.searchParams.set('VERSION', version);
  url.searchParams.set(typeParam, featureType);
  if (attributes !== undefined)
    url.searchParams.set('PROPERTYNAME', attributes.join(','));
  if (hitsOnly) {
    url.searchParams.set('RESULTTYPE', 'hits');
    url.searchParams.set(countParam, '1'); // in case the RESULTTYPE param is not supported
  } else if (maxFeatures !== undefined)
    url.searchParams.set(countParam, maxFeatures.toString(10));
  return url.toString();
}

/**
 * Generates an URL for a DescribeFeatureType operation
 * @param {string} serviceUrl
 * @param {WfsVersion} version
 * @param {string} featureType
 * @return {string}
 */
export function generateDescribeFeatureTypeUrl(
  serviceUrl,
  version,
  featureType
) {
  const typeParam = version === '2.0.0' ? 'TYPENAMES' : 'TYPENAME';
  const url = new URL(serviceUrl);
  url.searchParams.set('SERVICE', 'WFS');
  url.searchParams.set('REQUEST', 'DescribeFeatureType');
  url.searchParams.set('VERSION', version);
  url.searchParams.set(typeParam, featureType);
  return url.toString();
}