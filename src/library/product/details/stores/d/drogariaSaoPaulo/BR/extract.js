const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'drogariaSaoPaulo',
    transform: transform,
    domain: 'drogariasaopaulo.com.br',
    zipcode: '',
  }
};
