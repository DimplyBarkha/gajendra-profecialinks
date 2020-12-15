
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'zooplus',
    domain: 'zooplus.nl',
    url: 'https://www.zooplus.nl/esearch.htm#q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
