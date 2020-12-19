const { transform } = require('./format');
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
