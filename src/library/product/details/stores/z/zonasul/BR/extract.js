const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'BR',
    store: 'zonasul',
    transform,
    domain: 'zonasul.com.br',
    zipcode: '',
  },
};
