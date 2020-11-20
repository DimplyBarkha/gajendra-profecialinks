
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'zooroyal',
    domain: 'zooroyal.de',
    url: 'https://www.zooroyal.de/SwpFindologic/search?sSearch={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
