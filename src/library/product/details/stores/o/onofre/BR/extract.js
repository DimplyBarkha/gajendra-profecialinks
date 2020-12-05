const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'onofre',
    transform,
    domain: 'onofre.com.br',
    zipcode: '',
  },
  implementation: async ({ url }, { country, domain, transform }, context, { productDetails }) => {
    console.log('nilesh')
    return await context.extract(productDetails, { transform });
  },
};
