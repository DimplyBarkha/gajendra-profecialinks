const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SA',
    store: 'carrefour',
    transform,
    domain: 'carrefourksa.com',
    zipcode: "''",
  },
};
