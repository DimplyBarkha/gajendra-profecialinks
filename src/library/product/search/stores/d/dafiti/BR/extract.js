const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'dafiti',
    transform: transform,
    domain: 'dafiti.com.br',
    zipcode: '',
  },
};
