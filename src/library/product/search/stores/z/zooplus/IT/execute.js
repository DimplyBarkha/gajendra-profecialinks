
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'zooplus',
    domain: 'zooplus.it',
    url: 'https://www.zooplus.it/esearch.htm#q%3D{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
