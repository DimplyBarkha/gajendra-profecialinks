
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'NL',
    store: 'coolblue',
    nextLinkSelector: 'ul.pagination>li:last-child>a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: 'div.product-grid--loading',
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//h1[contains(.,"Geen resultaten voor")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'coolblue.nl',
    zipcode: '',
  },
};
