const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'stockmann',
    transform,
    domain: 'stockmann.com',
    zipcode: "''",
  },
};
