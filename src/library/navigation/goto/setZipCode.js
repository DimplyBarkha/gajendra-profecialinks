
/**
 *
 * @param { { url: any, zipcode: any } } inputs
 * @param { { country: any, domain: any, store: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { someAction: ImportIO.Action, someFunction: () => void, someExtraction: string } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  // const { url, zipcode } = inputs;
  // const { country, domain, store } = parameters;

  // TODO: add your impl - must be self contained (no require/import/external functions)
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
  ],
  inputs: [
    {
      name: 'url',
      description: '',
      optional: false,
    },
    {
      name: 'zipcode',
      description: '',
      optional: false,
    },
    {
      name: 'storeId',
      description: '',
      optional: false,
    },
  ],
  path: './domains/${domain[0:2]}/setZipCode.${domain}',
  implementation,
};
