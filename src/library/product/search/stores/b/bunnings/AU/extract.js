const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'bunnings',
    transform,
    domain: 'bunnings.com.au',
    zipcode: '',
  },
};
