const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'shopstyle',
    transform,
    zipcode: '',
    domain: 'shopstyle.com',
  },
};
