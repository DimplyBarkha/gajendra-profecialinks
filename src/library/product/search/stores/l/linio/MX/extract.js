const { transform } = require('./format');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'linio',
    transform,
    domain: 'linio.com.mx',
    zipcode: '',
  },
};
