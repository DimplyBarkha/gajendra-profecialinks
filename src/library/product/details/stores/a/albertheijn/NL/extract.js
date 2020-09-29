const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'albertheijn',
    transform,
    domain: 'ah.nl',
    zipcode: '',
  },
};
