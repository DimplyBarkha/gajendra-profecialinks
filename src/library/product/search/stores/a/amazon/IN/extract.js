const { transform } = require('../../../../transform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'IN',
    store: 'amazon',
    transform,
    domain: 'amazon.in',
    zipcode: '',
  },
  implementation,
};
