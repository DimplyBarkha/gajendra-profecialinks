const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'billa',
    transform: cleanUp,
    domain: 'billa.at',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
