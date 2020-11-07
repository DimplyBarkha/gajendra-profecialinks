const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'coop',
    transform,
    domain: 'coop.se',
    zipcode: "''",
  },
};
