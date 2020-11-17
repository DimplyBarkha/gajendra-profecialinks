const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DK',
    store: 'nemlig',
    transform,
    domain: 'nemlig.com',
    zipcode: "''",
  },
};
