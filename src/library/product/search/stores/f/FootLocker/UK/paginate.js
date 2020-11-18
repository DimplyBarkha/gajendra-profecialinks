module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'FootLocker',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: '//div[@class="fl-product-tile--basic"]//picture[@class="fl-picture"]/img/@srcset',
    noResultsXPath: '//div[@class="fl-status-page--content"]/h2[@class="fl-status-page--headline"][1]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'footlocker.co.uk',
    zipcode: '',
  },
};
