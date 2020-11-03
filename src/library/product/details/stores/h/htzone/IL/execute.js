const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IL',
    store: 'htzone',
    domain: 'htzone.co.il',
    transform: transform,
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
