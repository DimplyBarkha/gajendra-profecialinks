
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DE',
    store: 'idealo',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="resultlist"] *[class="offerList-item"]',
    noResultsXPath: '//div[contains(@class,"no-result-SuggestionText")]',
    loadedXpath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      pageIndexMultiplier: 15,
      pageStartNb: 0,
      template: 'https://www.idealo.de/preisvergleich/MainSearchProductCategory/100I16-{index}.html?q={searchTerms}',
    },
    domain: 'idealo.de',
    zipcode: '',
  },
};
