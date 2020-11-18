
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'FootLocker',
    nextLinkSelector: '.text-center > div >span',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: null,
    noResultsXPath: '//div[@class="fl-status-page--content"]/h2[@class="fl-status-page--headline"][1]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'footlocker.co.uk',
    zipcode: '',
  },
};
