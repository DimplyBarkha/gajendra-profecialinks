/**
 *
 * @param { { date: string, results: number} } inputs
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
  const { productReviews } = dependencies;
  return await context.extract(productReviews, { transform });
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
<<<<<<< HEAD
    {
      name: 'filterReviews',
      description: 'Boolean (true or false), filters out reviews outside given date.',
      optional: true,
    },
    {
      name: 'mergeType',
      description: 'In case of MERGE_ROWS, pass here',
      optional: true,
    },
=======
>>>>>>> ba1530b472d6acd392c50f4a7fc78f140e0bac06
  ],
  inputs: [
  ],
  dependencies: {
    productReviews: 'extraction:product/reviews/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,
};
