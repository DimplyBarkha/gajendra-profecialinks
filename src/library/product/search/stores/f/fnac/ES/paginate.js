
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'ES',
    store: 'fnac',
    nextLinkSelector: 'li.nextLevel1:not(.hide)',
    mutationSelector: null,
    spinnerSelector: '[class="Overlay Overlay--visible Overlay--header-layers"]',
    // loadedSelector: 'div.Article-item[id]',
    noResultsXPath: '//div[contains(@class, "noResults")] | //span[contains(@class, "js-Search-title") and contains(text(), "undefined")]',
    // openSearchDefinition: {
    //   template: 'https://www.fnac.es/SearchResult/ResultList.aspx?ItemPerPage=20&PageIndex={page}&Search={searchTerms}',
    // },
    domain: 'fnac.es',
    zipcode: '',
    stopConditionSelectorOrXpath: null,
  },
};
