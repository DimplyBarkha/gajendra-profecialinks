
/**
 *
 * @param { { storeId: any, zipcode: any } } inputs
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
      name: 'storeId',
      description: '',
      type: 'string',
      optional: true,
    },
    {
      name: 'zipcode',
      description: '',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
  },
  path: '../stores/${store[0:1]}/${store}/${country}/prepare',
  implementation,
};
