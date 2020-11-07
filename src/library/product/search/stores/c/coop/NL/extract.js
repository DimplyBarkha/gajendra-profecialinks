const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'coop',
    transform,
    domain: 'coop.nl',
    zipcode: "''",
  },
};
