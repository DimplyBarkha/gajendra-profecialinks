const { transform } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'chedraui',
    transform: transform,
    domain: 'chedraui.com.mx',
    zipcode: "''",
  },
};
