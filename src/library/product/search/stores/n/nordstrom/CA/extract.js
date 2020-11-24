const { transform } = require('../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'CA',
    store: 'nordstrom',
    transform,
    domain: 'nordstrom.com',
    zipcode: '',
  },
};
