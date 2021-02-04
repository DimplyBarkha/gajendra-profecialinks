
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'CA',
    store: '180smoke',
    nextLinkSelector: null,
    nextLinkXpath: '//a[contains(text(),"Next")]',
    mutationSelector: null,
    spinnerSelector: 'div.overlay-loading',
    loadedSelector: null,
    loadedXpath: '//div[contains(@class,"h-100")]',
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: '180smoke.ca',
    zipcode: '',
  },
};
