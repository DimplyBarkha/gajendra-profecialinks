module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    domain: 'homedepot.ca',
    url: 'https://www.homedepot.ca/',
    loadedSelector: 'global-header-categories',
    noResultsXPath: null,
    zipcode: '',
  },
};
