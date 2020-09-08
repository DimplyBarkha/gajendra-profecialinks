const { transform } = require('../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'binglee',
    transform: transform,
    domain: 'binglee.com.au',
    zipcode: '',
  },
};
