const { transform } = require('./format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'haarshop',
    transform,
    domain: 'haarshop.nl',
    zipcode: '',
  },
};
