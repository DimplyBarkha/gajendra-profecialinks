const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'neimanmarcus',
    transform,
    zipcode: '',
    domain: 'neimanmarcus.com',
  },
};
