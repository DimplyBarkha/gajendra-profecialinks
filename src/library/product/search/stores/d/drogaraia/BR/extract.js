const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'drogaraia',
    transform: transform,
    domain: 'drogaraia.com.br',
    zipcode: '',
  },
};
