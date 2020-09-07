const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'haar-shop',
    transform,
    domain: 'haar-shop.ch',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    return await context.extract(productDetails, { transform });
  },
};
