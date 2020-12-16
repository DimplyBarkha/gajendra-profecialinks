const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'drogaraia',
    transform: transform,
    domain: 'drogaraia.com.br',
    zipcode: '',
  },
};
