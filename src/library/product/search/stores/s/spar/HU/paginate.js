
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'HU',
    store: 'spar',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'img.tile-basic__image.tile-basic__image--product',
    loadedXpath: null,
    noResultsXPath: '//h2[contains(@class,"h4 headline__h4 text--center")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'spar.hu',
    zipcode: '',
  },
};
