const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'tigota',
    transform,
    domain: 'tigota.it',
    zipcode: "''",
  },
};
