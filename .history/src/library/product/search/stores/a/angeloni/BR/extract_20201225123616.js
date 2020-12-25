const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'angeloni',
    transform,
    domain: 'angeloni.com.br/super',
    zipcode: '',
  },
};
