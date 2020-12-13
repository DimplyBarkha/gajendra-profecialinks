const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'woolworths',
    transform: transform,
    domain: 'woolworths.com.au',
    zipcode: "''",
  },
};
