
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'TR',
    store: 'e-bebek',
    nextLinkSelector: 'a[rel="next"]',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section.product-list',
    loadedXpath: null,
    noResultsXPath: '//div[@class="product-detail-main bg-white static static-page"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'e-bebek.com',
    zipcode: '',
  },
};
