
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'lyreco',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img.imgRoco',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"DidYouMean")]//b',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'lyreco.com',
    zipcode: '',
  },
};
