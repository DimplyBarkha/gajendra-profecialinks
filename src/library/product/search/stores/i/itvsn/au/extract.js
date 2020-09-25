const { transform } = require('./shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'AU',
    store: 'itvsn',
    transform,
    domain: 'itvsn.com.au',
    zipcode: '',
  },
};
