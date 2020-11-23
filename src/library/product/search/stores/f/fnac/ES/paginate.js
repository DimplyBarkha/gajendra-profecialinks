
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    // nextLinkSelector: 'li.nextLevel1',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.Article-item[id]',
    noResultsXPath: '//div[contains(@class, "noResults")]|//span[contains(@class, "js-Search-title") and contains(text(), "undefined")]',
    openSearchDefinition: {
      template: 'https://www.fnac.es/SearchResult/ResultList.aspx?ItemPerPage=20&PageIndex={page}&Search={searchTerms}',
    },
    domain: 'fnac.es',
    zipcode: '',
  },
};
