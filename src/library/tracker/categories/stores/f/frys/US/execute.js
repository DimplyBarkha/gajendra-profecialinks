
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'US',
    store: 'frys',
    domain: 'frys.com',
    loadedSelector: 'a[style="text-decoration:none"]>font[size="1"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
