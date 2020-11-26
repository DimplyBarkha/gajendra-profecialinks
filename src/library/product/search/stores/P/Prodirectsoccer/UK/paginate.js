
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'Prodirectsoccer',
    nextLinkSelector: '.lister-grid__pagination > div > a:last-child',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//section[@class="container-inner"]//div[@class="product-lister"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'prodirectsoccer.com',
    zipcode: '',
  },
};
