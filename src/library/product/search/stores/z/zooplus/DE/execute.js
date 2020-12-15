
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'zooplus',
    domain: 'zooplus.de',
    url: 'https://www.zooplus.de/esearch.htm#q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
