
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'blu',
    nextLinkSelector: 'button[data-testid="reviews-block-page-next"]:enabled',
    // nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: 'div.sc-1xuymxc-0.ExfKH',
    spinnerSelector: null,
    loadedSelector: 'div[data-testid="pageShellBody"]',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'blu.com',
    zipcode: '',
  },
};
