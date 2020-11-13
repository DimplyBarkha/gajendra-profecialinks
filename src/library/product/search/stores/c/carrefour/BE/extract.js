const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'BE',
    store: 'carrefour',
    transform,
    domain: 'carrefour.eu',
    zipcode: "''",
  },
};
