const { transform } = require('../../../../shared');
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productDetails } = dependencies;
  return await context.extract(productDetails);
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'abt',
    transform: transform,
    domain: 'abt.com',
    zipcode: '',
  },
  implementation,
};
