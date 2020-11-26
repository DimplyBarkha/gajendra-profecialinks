
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'zalando',
    nextLinkSelector: null,
    nextLinkXpath: '//a[@title="next page" and not(contains(@class, "disabled"))]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'script[id="z-nvg-cognac-props"]',
    loadedXpath: null,
    noResultsXPath: '//span[contains(text(), "Try a different search term or check the spelling.")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'zalando.de',
    zipcode: '',
  },
};
