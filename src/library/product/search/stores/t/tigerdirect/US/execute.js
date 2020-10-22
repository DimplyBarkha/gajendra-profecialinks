
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'tigerdirect',
    domain: 'tigerdirect.com',
    url: 'https://www.tigerdirect.com/applications/SearchTools/search.asp?keywords={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
