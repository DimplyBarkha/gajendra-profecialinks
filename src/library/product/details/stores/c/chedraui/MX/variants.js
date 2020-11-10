const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/variants',
  parameterValues: {
    country: 'MX',
    store: 'chedraui',
    transform: transform,
    domain: 'chedraui.com.mx',
    zipcode: "''",
  },
};
