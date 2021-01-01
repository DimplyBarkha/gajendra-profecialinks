
const { transform } = require('./shared');

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
    country: 'BR',
    store: 'drogaraia',
    transform: transform,
    domain: 'drogaraia.com.br',
    zipcode: '',
  },
  implementation,
};
