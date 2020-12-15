
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'zooplus',
    domain: 'zooplus.fr',
    url: 'https://www.zooplus.fr/esearch.htm#q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
