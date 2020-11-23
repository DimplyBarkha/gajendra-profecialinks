const { transform } = require('../../../../shared');
/* async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  return await context.extract(productDetails, { transform, type: 'MERGE_ROWS' });
} */
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SI',
    store: 'mimovrste',
    transform: transform,
    domain: 'mimovrste.com',
    zipcode: '',
  },
  // implementation,
};
