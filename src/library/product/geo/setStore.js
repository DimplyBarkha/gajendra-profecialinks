
/**
 *
 * @param { { url: any, id: any, geoParam: any } } inputs
 * @param { { country: any, domain: any, store: any, zipcode: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  // TODO: add your impl - must be self contained (no require/import/external functions)
  return 'needGeoSpecificUrl';
}

module.exports = {
  parameters: [
    {
      name: 'country',
      description: '',
      optional: false,
    },
    {
      name: 'domain',
      description: '',
      optional: false,
    },
    {
      name: 'store',
      description: '',
      optional: false,
    },
    {
      name: 'zipcode',
      description: '',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'url',
      description: '',
      type: 'string',
      optional: true,
    },
    {
      name: 'id',
      description: '',
      type: 'string',
      optional: true,
    },
    {
      name: 'geoParam',
      description: '',
      type: 'string',
      optional: false,
    },
  ],
  dependencies: {},
  path: './stores/${store[0:1]}/${store}/${country}/setStore',
  implementation,
};
