
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'zooroyal',
    domain: 'zooroyal.de',
    url: 'https://www.zooroyal.de/SwpFindologic/search?sSearch={searchTerms}',
    loadedSelector: 'div#article-list div.product--box',
    noResultsXPath: null,
    zipcode: '',
  },
};
