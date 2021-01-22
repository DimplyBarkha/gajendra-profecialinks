
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'CA',
    store: '180smoke',
    nextLinkSelector: null,
    nextLinkXpath: '//a[contains(text(),"Next")]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'article.page-product-view--review',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: '180smoke.ca',
    zipcode: '',
  },
};
