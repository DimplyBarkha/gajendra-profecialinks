const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'eobuwie',
    transform,
    domain: 'eobuwie.com.pl',
    zipcode: "''",
  },
};
