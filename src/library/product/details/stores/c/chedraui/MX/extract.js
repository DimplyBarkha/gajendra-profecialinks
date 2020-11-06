const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'chedraui',
    transform,
    domain: 'chedraui.com.mx',
    zipcode: "''",
  },
};
