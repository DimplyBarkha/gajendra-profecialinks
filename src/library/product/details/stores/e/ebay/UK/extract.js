const { implementation } = require('../shared');
// const { transform } = require('../format');
const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'ebay',
    transform,
    domain: 'ebay.co.uk',
    zipcode: '',
  },
  implementation,
};
