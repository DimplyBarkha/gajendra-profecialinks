const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CH',
    store: 'haar-shop',
    transform: transform,
    domain: 'haar-shop.ch',
    zipcode: '',
  },
  implementation,
};
