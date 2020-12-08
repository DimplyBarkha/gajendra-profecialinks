const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'walmart',
    transform,
    domain: 'walmart.com.mx',
    zipcode: '',
  },
};
