import capabilities200 from '../../fixtures/wfs/capabilities-pigma-2-0-0.xml';
import WfsEndpoint from './endpoint';

describe('WfsEndpoint', () => {
  /** @type {WfsEndpoint} */
  let endpoint;

  beforeEach(() => {
    window.fetch = jest.fn(() => {
      return Promise.resolve({
        text: () => Promise.resolve(capabilities200),
        status: 200,
        ok: true,
      });
    });

    endpoint = new WfsEndpoint(
      'https://my.test.service/ogc/wfs?service=wfs&request=DescribeFeatureType&featureType=myfeatures'
    );
  });

  it('makes a getcapabilities request', () => {
    expect(window.fetch).toHaveBeenCalledWith(
      'https://my.test.service/ogc/wfs?featureType=myfeatures&SERVICE=WFS&REQUEST=GetCapabilities'
    );
  });

  describe('#isReady', () => {
    it('resolves with the endpoint object', async () => {
      await expect(endpoint.isReady()).resolves.toEqual(endpoint);
    });
  });

  describe('#getVersion', () => {
    it('returns the correct version', async () => {
      await endpoint.isReady();
      expect(endpoint.getVersion()).toBe('2.0.0');
    });
  });

  describe('#getFeatureTypes', () => {
    it('returns a list of feature types', async () => {
      await endpoint.isReady();

      // only check featuretype names for readability
      expect(endpoint.getFeatureTypes()).toMatchObject([
        {
          name: 'asp:asp_rpg2010',
        },
        {
          name: 'cd16:comptages_routiers_l',
        },
        {
          name: 'cd16:hierarchisation_l',
        },
      ]);
    });
  });

  describe('#getFeatureTypeByName', () => {
    it('returns detailed info on a feature type', async () => {
      await endpoint.isReady();
      expect(endpoint.getFeatureTypeByName('cd16:hierarchisation_l')).toEqual({
        abstract:
          'Hiérarchisation du réseau routier départemental en fonction des caractéristiques de chaque section\n                de route et de son usage au 1er Janvier 2021.\r\n                \r\n                Mise à jour : Mars 2021\n            ',
        defaultCrs: 'EPSG:2154',
        latLonBoundingBox: [
          '-0.4832134559131876',
          '45.18037755571674',
          '0.9725372441782966',
          '46.13877580094452',
        ],
        name: 'cd16:hierarchisation_l',
        otherCrs: ['EPSG:32615', 'EPSG:32616', 'EPSG:32617', 'EPSG:32618'],
        outputFormats: [
          'application/gml+xml; version=3.2',
          'text/xml; subtype=gml/3.2.1',
          'text/xml; subtype=gml/3.1.1',
          'text/xml; subtype=gml/2.1.2',
        ],
        title: 'CD 16 - Hiérarchisation du réseau',
      });
    });
  });

  describe('#getServiceInfo', () => {
    it('returns service info', async () => {
      await endpoint.isReady();
      expect(endpoint.getServiceInfo()).toEqual({
        abstract: "Service WFS de l'IDS régionale PIGMA",
        constraints: 'aucun',
        fees: 'aucun',
        name: 'WFS',
        title: "Service WFS de l'IDS régionale PIGMA",
      });
    });
  });
});