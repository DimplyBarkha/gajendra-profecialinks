const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'costco',
    transform,
    domain: 'costco.com.mx',
    zipcode: '',
  },
};
