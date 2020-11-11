const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FI',
    store: 'foodie',
    transform,
    domain: 'foodie.fi',
    zipcode: "''",
  },
};
