
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'DK',
    store: 'lomax',
    nextLinkSelector: null,
    nextLinkXpath: '(//nav[@aria-label="orders products pages"]/ul/li/a/@href)[2]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    loadedXpath: null,
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'lomax.dk',
    zipcode: '',
  },
};
