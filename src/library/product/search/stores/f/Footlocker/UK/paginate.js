
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'Footlocker',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: '.fl-product-tile--image-container>.fl-picture > .fl-picture--img',
    loadedXpath: null,
    noResultsXPath: '//div[@class="fl-status-page--content"]/h2[@class="fl-status-page--headline"][1]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'footlocker.co.uk',
    zipcode: '',
  },
};
