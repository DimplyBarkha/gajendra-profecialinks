const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BR',
    store: 'magazineluiza',
    transform,
    domain: 'magazineluiza.com.br',
    zipcode: "''",
  },
};
