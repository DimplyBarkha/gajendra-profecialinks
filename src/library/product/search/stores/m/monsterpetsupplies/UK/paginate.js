
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'monsterpetsupplies',
    nextLinkSelector: null,
    nextLinkXpath: '(//a[@aria-label="Next"])[1]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="product-list"]',
    noResultsXPath: '//h1[contains(text(), "No results for")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'monsterpetsupplies.co.uk',
    zipcode: '',
  },
};
