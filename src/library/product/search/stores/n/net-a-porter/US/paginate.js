
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'net-a-porter',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: 'div[itemprop="item"]',
    openSearchDefinition: {
      template: 'https://www.net-a-porter.com/en-us/shop/search/{queryParams}&pageNumber={page}',
    },
    zipcode: '',
    domain: 'net-a-porter.com',
  },
};
