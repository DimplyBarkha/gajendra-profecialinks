
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'FR',
    store: 'backmarket',
    nextLinkSelector: 'button[data-test="pagination-next"]',
    nextLinkXpath: '//button[@data-test="pagination-next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="main_container"]',
    loadedXpath: '//div[@id="main_container"]',
    noResultsXPath: '//div[@data-test="search-landing-no-result"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'backmarket.fr',
    zipcode: "''",
  },
};
