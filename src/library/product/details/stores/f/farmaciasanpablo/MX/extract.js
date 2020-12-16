const { transform } = require('../transform.js');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'farmaciasanpablo',
    transform: transform,
    domain: 'farmaciasanpablo.com.mx',
    zipcode: '',
  },
};
