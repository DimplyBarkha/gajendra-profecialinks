const { transform } = require('../shared')
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
