const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IT',
    store: 'tigota',
    transform,
    domain: 'tigota.it',
    zipcode: "''",
  },
};
