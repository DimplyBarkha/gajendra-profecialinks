const { transform } = require('../shared');
const { implementation } = require('../US/extract');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CA',
    store: 'nordstrom',
    transform,
    domain: 'nordstrom.com',
    zipcode: '',
  },
  implementation,
};
