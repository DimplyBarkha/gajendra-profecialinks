
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AE',
    store: 'taw9eel',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: 'div#main-container',
    noResultsXPath: '//div[@id="col-main" and @class="col-main"]/p[contains(text(),"Your search returns no results.")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'taw9eel.com',
    zipcode: '',
  },
};
