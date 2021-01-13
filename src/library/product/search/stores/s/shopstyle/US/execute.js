const { implementation } = require('../sharedExecute');

module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'shopstyle',
    domain: 'shopstyle.com',
    url: 'https://www.shopstyle.com/api/v2/site/{queryParams}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
  implementation,
};
