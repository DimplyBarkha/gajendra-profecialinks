
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'Freshamazon',
    nextLinkSelector: 'li[class="a-last"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-asin][data-component-type=s-search-result]',
    loadedXpath: null,
    noResultsXPath: '//span[contains(text(),"Keine Ergebnisse")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'amazon.de',
    zipcode: '10243',
  },
};
