
const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'binglee',
    transform: transform,
    domain: 'binglee.com.au',
    zipcode: '',
  },
};
