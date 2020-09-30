const { transform } = require('./transform');
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
