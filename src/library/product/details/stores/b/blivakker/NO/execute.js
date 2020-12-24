const { transform } = require('../../../../shared');

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NO',
    store: 'blivakker',
    domain: 'blivakker.no',
    transform: transform,
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
