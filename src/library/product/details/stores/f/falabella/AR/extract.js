const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AR',
    store: 'falabella',
    transform,
    domain: 'falabella.com.ar',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    return await context.extract(productDetails, { transform });
  },
};
