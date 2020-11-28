const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'totalwine',
    transform,
    filterReviews: null,
    domain: 'totalwine.com',
    zipcode: '',
  },
  implementation: async (
    inputs,
    parameters,
    context,
    dependencies) => {
    const { transform } = parameters;
    const { productReviews } = dependencies;
    return await context.extract(productReviews, { transform, type: 'MERGE_ROWS' });
  },
};
