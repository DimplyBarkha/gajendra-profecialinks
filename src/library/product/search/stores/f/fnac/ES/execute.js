
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    domain: 'fnac.es',
    url: 'https://www.fnac.es/SearchResult/ResultList.aspx?Search={searchTerms}',
    loadedSelector: 'div.Article-itemInfo',
    noResultsXPath: '//div[contains(@class, "noResults")]',
    zipcode: '',
  },
};
