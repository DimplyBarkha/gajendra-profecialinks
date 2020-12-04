const { transform } = require('./transform');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'walmart',
    transform: null,
    domain: 'walmart.com.mx',
    zipcode: "''",
  },
};
