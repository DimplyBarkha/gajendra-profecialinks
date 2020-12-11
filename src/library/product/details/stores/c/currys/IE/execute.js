const { implementation } = require('../executeImplementation');

module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'currys',
    domain: 'currys.ie',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: 'D02TX94',
  },
  implementation,
};
