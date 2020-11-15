
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'superama',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.portfolio.full-portfolio.grids ul li',
    loadedXpath: null,
    //noResultsXPath: '//div[@class="error__images"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'superama.com.mx',
    zipcode: '',
  },
};
