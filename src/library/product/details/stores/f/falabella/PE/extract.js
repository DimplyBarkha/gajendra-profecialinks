
const { transform } = require('../format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PE',
    store: 'falabella',
    transform,
    domain: 'falabella.com.pe',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    return await context.extract(productDetails, { transform });
  },
};
