const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    transform: transform,
    domain: 'superdrug.com',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { transform } = parameters;
    const { productReviews } = dependencies;
    return await context.extract(productReviews, { transform });
  },
};
