const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'drogariasaopaulo',
    transform: transform,
    domain: 'drogariasaopaulo.com.br',
    zipcode: '',
  },
};
