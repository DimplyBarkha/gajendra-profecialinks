
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'mytime',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: 'div.product-page__rating span.starbar__counter',
    noResultsXPath: '//div[@class="product-page__rating"]//div/span[1][not(contains(@class, "active"))] | //picture[@data-alt="Wechsler-Fehlserseite"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mytime.de',
    zipcode: '',
  },
};
