const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'carrefour',
    transform,
    domain: 'carrefour.eu',
    zipcode: "''",
  },
};
