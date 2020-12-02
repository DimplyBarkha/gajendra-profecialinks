const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'plein',
    transform,
    domain: 'plein.nl',
    zipcode: '',
  },
};
