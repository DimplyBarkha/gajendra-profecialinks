const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'linio',
    transform,
    domain: 'linio.com.mx',
    zipcode: '',
  },
};
