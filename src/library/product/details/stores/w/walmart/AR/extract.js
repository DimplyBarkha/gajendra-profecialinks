const { transform } = require('./shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AR',
    store: 'walmart',
    transform,
    domain: 'walmart.com.ar',
    zipcode: '',
  },
};
