const { transform } = require('../../wayfair/shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productReviews } = dependencies;
  return await context.extract(productReviews, { transform, type: 'MERGE_ROWS' });
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    transform: transform,
    domain: 'wayfair.com',
    zipcode: '',
  },
  implementation,
};
