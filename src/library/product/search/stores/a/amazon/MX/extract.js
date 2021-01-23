const { transform } = require('../sharedTransform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'MX',
    store: 'amazon',
    transform,
    domain: 'amazon.com.mx',
    zipcode: '',
  },
  implementation,
};
