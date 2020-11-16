
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PL',
    store: 'makro',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedXpath: '//h1//span[text() = "Wyniki wyszukiwania"]',
    noResultsXPath: '//h3/span[text()="Brak wyników!"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'makro.pl',
    zipcode: '',
  },
};
