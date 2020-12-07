
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'BR',
    store: 'drogaraia',
    nextLinkSelector: null,
    nextLinkXpath: '//a[contains(@class, "next_page")]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div h2',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class, "noresults")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'drogaraia.com.br',
    zipcode: '',
  },
};
