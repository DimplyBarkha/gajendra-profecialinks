
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'zooplus',
    domain: 'zooplus.it',
    url: 'https://www.zooplus.it/esearch.htm#q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
