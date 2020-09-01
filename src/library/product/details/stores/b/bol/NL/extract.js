const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'bol',
    transform,
    domain: 'bol.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    return await context.extract(productDetails, { transform: transformParam });
  },
};
