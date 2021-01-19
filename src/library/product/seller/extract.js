/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { sellerDetails } = dependencies;
  return await context.extract(sellerDetails, { transform });
}

module.exports = {
  parameters: [
    {
      name: 'country',
      description: '2 letter ISO code for the country',
    },
    {
      name: 'store',
      description: 'store name',
    },
    {
      name: 'transform',
      description: 'transform function for the extraction',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'url',
      description: 'url of seller',
      type: 'string',
      optional: true,
    },
    {
      name: 'id',
      description: 'unique identifier for seller',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    sellerDetails: 'extraction:product/seller/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
