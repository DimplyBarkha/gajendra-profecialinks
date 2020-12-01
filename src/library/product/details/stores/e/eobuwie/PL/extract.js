const { transform } = require('./format')
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'eobuwie',
    transform,
    domain: 'eobuwie.com.pl',
    zipcode: '',
  },
};
