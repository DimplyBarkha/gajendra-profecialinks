
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'neimanmarcus',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: 'div[class*="product-thumbnail grid"]',
    openSearchDefinition: {
      template: 'https://www.neimanmarcus.com/{queryParams}?page={page}',
    },
    zipcode: '',
    domain: 'neimanmarcus.com',
  },
};
