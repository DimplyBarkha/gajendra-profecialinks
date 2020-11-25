
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'petco',
    nextLinkSelector: '.pagination > li:last-child > a',
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.product-image img',
    loadedXpath: null,
    noResultsXPath: '//div[contains(@class,"blankResultsConatiner")]//p[contains(@class,"blankTitle")][1]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'petco.us',
    zipcode: '',
  },
};
