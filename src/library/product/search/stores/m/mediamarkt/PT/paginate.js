
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'PT',
    store: 'mediamarkt',
    nextLinkSelector: 'li a.snize-pagination-next',
    nextLinkXpath: "//li//a[@class='snize-pagination-next']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: "//div[contains(@class, 'snize-no-products-found-text')]",
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'mediamarkt.pt',
    zipcode: '',
  },
};
