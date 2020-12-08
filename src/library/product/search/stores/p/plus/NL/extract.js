const { transform } = require('./transform');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'NL',
    store: 'plus',
    transform,
    domain: 'plus.nl',
    zipcode: '',
  },

};
