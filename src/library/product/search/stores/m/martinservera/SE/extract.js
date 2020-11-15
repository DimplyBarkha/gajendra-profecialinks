const { transform } = require('./format');

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'martinservera',
    transform,
    domain: 'martinservera.se',
    zipcode: '',
  },
};
