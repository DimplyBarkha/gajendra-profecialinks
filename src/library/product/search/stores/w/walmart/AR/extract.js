const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AR',
    store: 'walmart',
    timeout: 50000,
    transform: transform,
    domain: 'walmart.com.ar',
    zipcode: '',
  },
};
