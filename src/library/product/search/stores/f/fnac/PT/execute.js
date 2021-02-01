
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PT',
    store: 'fnac',
    domain: 'fnac.pt',
    url: 'https://www.fnac.pt/SearchResult/ResultList.aspx?Search={searchTerms}',
    loadedSelector: 'article[class*="Article-itemGroup"]',
    noResultsXPath: '//div[contains(@class, "noResults")]',
    zipcode: '',
  },
};
