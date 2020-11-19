
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'shoplet',
    nextLinkSelector: null,
    nextLinkXpath: '//ul[contains(@class,"pagination ")]/li[contains(@class,"next")]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.padTop30',
    loadedXpath: null,
    noResultsXPath: '//h2[text()="There were no results for your search."]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'shoplet.com',
    zipcode: '',
  },
};
