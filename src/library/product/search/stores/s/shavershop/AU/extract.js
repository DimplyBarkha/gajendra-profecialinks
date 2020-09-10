const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'shavershop',
    transform,
    domain: 'shavershop.com.au',
    zipcode: '',
  },
};
