const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'UK',
    store: 'coop',
    transform,
    domain: 'coop.co.uk',
    zipcode: "''",
  },
};
