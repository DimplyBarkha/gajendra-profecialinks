const { transform } = require('../../../../transform');
const { implementation } = require('../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'TR',
    store: 'amazon',
    transform,
    domain: 'amazon.com.tr',
    zipcode: '',
  },
  implementation,
};
