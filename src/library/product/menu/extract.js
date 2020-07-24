
/**
 *
 * @param { {  } } inputs
 * @param { { country: any, domain: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { someAction: ImportIO.Action, someFunction: () => void, someExtraction: string } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const {} = inputs;
  const { country, domain } = parameters;

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
  ],
  inputs: [],
  dependencies: {
    productDetails: 'extraction:product/menu/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
