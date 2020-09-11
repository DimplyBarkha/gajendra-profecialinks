const { transform } = require('../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'MX',
    store: 'liverpool',
    transform,
    domain: 'liverpool.com.mx',
    zipcode: '',
  },
};
