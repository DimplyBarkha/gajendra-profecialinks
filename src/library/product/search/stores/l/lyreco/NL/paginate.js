
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NL',
    store: 'lyreco',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.picture_grid a.prod_visu img',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"DidYouMean")]//b',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'lyreco.com',
    zipcode: '',
  },
};
