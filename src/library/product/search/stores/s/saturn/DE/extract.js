const { transform } = require('./transform');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'DE',
    store: 'saturn',
    transform,
    domain: 'saturn.de',
    zipcode: '',
  },
};
