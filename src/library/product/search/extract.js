/**
 *
 * @param { { } } inputs
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
  const { transform, mergeType } = parameters;
  const { productDetails } = dependencies;
  const mergeOptions = !mergeType ? { transform } : { transform, type: mergeType };
  const data = await context.extract(productDetails, mergeOptions);
  return { data, mergeType };
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
    {
      name: 'mergeType',
      optional: true,
    },
  ],
  inputs: [
  ],
  dependencies: {
    productDetails: 'extraction:product/search/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
