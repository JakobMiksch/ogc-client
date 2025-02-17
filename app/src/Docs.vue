<template>
  <div>
    <h2 class="mb-4">Presentation</h2>

    <p>
      <LibName></LibName> is a pure Javascript library made for interacting with
      geospatial web services relying on standard protocols, namely
      <a href="https://www.ogc.org/docs/is">OGC standards.</a>
    </p>

    <p>
      Its purpose is to helps you interact with them in a user-friendly and
      consistent way.
    </p>

    <p>Its main features include:</p>

    <ul>
      <li>
        Support for <a href="https://www.ogc.org/standards/wfs">WFS</a> and
        <a href="https://www.ogc.org/standards/wms">WMS</a> protocols
      </li>
      <li>Elaborate cache system to minimize network requests</li>
      <li>
        Fast parsing of XML documents using
        <a href="https://github.com/rgrove/parse-xml">@rgrove/parse-xml</a>
      </li>
      <li>
        Detection of
        <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">CORS</a
        >-related issues
      </li>
    </ul>

    <h2 class="mt-5 mb-4">Usage</h2>

    <p>First, install <LibName></LibName> in your project:</p>

    <p>
      <CodeBlock lang="sh"
        >$ npm install --save @camptocamp/ogc-client</CodeBlock
      >
    </p>

    <p>Then, use it like so:</p>

    <p>
      <CodeBlock lang="js">
        <pre>
  import { WfsEndpoint } from '@camptocamp/ogc-client';

  new WfsEndpoint('https://my.server.org/ows')
    .then(endpoint => endpoint.supportsJson());</pre
        >
      </CodeBlock>
    </p>

    <p>
      Please refer to the API section for more details on how to use each
      functionality.
    </p>

    <div class="card text-bg-light mb-3">
      <div class="card-header">A note on text encoding</div>
      <div class="card-body">
        <p class="card-text">
          Even though <strong>UTF-8</strong> is the most common text encoding in
          the web, some services might respond with other encodings such as
          <strong>UTF-16</strong>,
          <strong
            ><a href="https://en.wikipedia.org/wiki/ISO/IEC_8859-1"
              >ISO-8859-1</a
            ></strong
          >, etc.
        </p>
        <p class="card-text">
          <LibName></LibName> will attempt to decode the responses using the
          information at its disposal, and in most case decoding should succeed.
          It may happen though that some unrecognized characters will remain;
          please
          <a href="https://github.com/camptocamp/ogc-client/issues/new"
            >open an issue</a
          >
          if that is the case!
        </p>
      </div>
    </div>

    <h2 class="mt-5 mb-4">Why use it?</h2>

    <p>
      Many libraries are able to leverage OGC protocols for various specialized
      tasks, for instance downloading data or rendering maps. Often times
      though, the application code has the responsibility to specify the version
      to use, the coordinate system, the bounding box to query, etc.
    </p>

    <p>
      <LibName></LibName> intends to assist applications in discovering OGC
      services and what they offer, without having to manually write code for
      parsing GetCapabilities documents for example.
    </p>

    <p>
      When an network error is encountered, <LibName></LibName> will do an
      additional check to determine whether this is due to
      <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">CORS</a>
      limitations. This will help the application code in giving an appropriate
      feedback to the user, i.e. that the targeted resource is indeed reachable
      but does not allow cross-origin usage.
    </p>

    <p>
      <LibName></LibName> also keeps a cache of all operations using the
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/Cache"
        >Cache API</a
      >, thus offering almost limitless storage while also purging expired cache
      entries regularly. By default, all cache entries are kept for one hour.
    </p>

    <p>What <LibName></LibName> currently does not do:</p>

    <ul>
      <li>
        No <a href="https://www.ogc.org/standards/wmts">WMTS</a> parsing:
        alternatives already exist, such as the OpenLayers
        <a
          href="https://openlayers.org/en/latest/apidoc/module-ol_format_WMTSCapabilities-WMTSCapabilities.html"
          >WMTS Capabilities</a
        >
        class (<a
          href="https://openlayers.org/en/latest/examples/wmts-capabilities.html"
          >example</a
        >)
      </li>
      <li>
        No GML geometry parsing: again,
        <a
          href="https://openlayers.org/en/latest/apidoc/module-ol_format_GML32-GML32.html"
          >alternatives do exist</a
        >
      </li>
    </ul>

    <h2 class="mt-5 mb-4">Examples</h2>

    <h5>Read a WMS layer extent</h5>

    <p>
      <CodeBlock lang="js">
        <pre>
  import { WmsEndpoint } from '@camptocamp/ogc-client';

  async function readExtent() {
    const endpoint = await new WmsEndpoint('https://my.server.org/ows').isReady();
    const layer = endpoint.getLayerByName();
    const extent = layer.boundingBoxes['EPSG:4326'];
  }</pre
        >
      </CodeBlock>
    </p>

    <h5>Compute a WFS GetFeature url</h5>

    <p>
      <CodeBlock lang="js">
        <pre>
  import { WfsEndpoint } from '@camptocamp/ogc-client';

  async function getFeatureUrl() {
    const endpoint = await new WfsEndpoint('https://my.server.org/ows').isReady();
    const url = endpoint.getFeatureUrl('my:featureType', {
      asJson: true,
      maxFeature: 1000
    });
  }</pre
        >
      </CodeBlock>
    </p>

    <h5>Query the first 10 items of an OGC API Records collection</h5>

    <p>
      <CodeBlock lang="js">
        <pre>
  import { OgcApiEndpoint } from '@camptocamp/ogc-client';

  async function getFirstTenRecords() {
    const endpoint = await new OgcApiEndpoint('https://my.server.org/main')
    const firstCollection = (await endpoint.recordCollections)[0];
    return endpoint.getCollectionItems(firstCollection, 10, 0);
  }</pre
        >
      </CodeBlock>
    </p>

    <h2 class="mt-5 mb-4">API</h2>

    <ApiDescription></ApiDescription>
  </div>
</template>

<script>
import CodeBlock from './components/presentation/CodeBlock.vue';
import ApiDescription from './components/api/ApiDescription.vue';
import LibName from './components/presentation/LibName.vue';

export default {
  name: 'Docs',
  components: { CodeBlock, ApiDescription, LibName },
  async mounted() {
    hljs.highlightAll();
  },
};
</script>

<style scoped></style>
