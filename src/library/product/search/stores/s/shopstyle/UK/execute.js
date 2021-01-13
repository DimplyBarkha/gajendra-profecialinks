const { implementation } = require('../sharedExecute');

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'shopstyle',
    domain: 'shopstyle.co.uk',
    url: 'https://www.shopstyle.co.uk/api/v2/{queryParams}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
