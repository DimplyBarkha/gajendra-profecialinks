const { transform } = require('./format');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AR',
    store: 'carrefour',
    transform,
    domain: 'carrefour.com.ar',
    zipcode: '',
  },
};
