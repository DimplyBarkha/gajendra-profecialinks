
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'nicokick',
    nextLinkSelector: null,
    nextPageUrlSelector: null,
    nextLinkXpath: '(//a[contains(@class,"next")])[2]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#layer-product-list',
    loadedXpath: null,
    noResultsXPath: '//h1[contains(text(),"00PS!")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'nicokick.com',
    zipcode: '',
  },
};
