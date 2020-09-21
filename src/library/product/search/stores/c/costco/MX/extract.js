const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'costco',
    transform,
    domain: 'costco.com.mx',
    zipcode: '',
  },
};
