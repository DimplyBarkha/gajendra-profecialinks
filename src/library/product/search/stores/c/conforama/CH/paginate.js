
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'CH',
    store: 'Conforama',
    nextLinkSelector: 'div.ctrl-next a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'article.box-product',
    loadedXpath: null,
    noResultsXPath: '//section[contains(@class,"emptySearch")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'Conforama.ch',
    zipcode: '',
  },
};
