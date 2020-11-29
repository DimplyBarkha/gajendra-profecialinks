module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'FootLocker',
    nextLinkSelector: '.text-center > div > .fl-btn--inner',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.fl-product-tile--image-container>.fl-picture > .fl-picture--img',
    loadedXpath: null,
    noResultsXPath: '//div[@class="fl-status-page--content"]/h2[@class="fl-status-page--headline"][1]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'footlocker.co.uk',
    zipcode: '',
  },
};
