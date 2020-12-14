module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'homedepot',
    domain: 'homedepot.ca',
    url: 'https://www.homedepot.ca/api/search/v1/search?q={searchTerms}',
    loadedSelector: 'pre',
    noResultsXPath: null,
    zipcode: '',
  },
};
