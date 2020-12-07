
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'superama_mx',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.portfolio.full-portfolio.grids ul li',
    loadedXpath: null,
    noResultsXPath: '//div[@id="conten_error"]/@style[contains(.,"block")]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'superama.com.mx',
    zipcode: '',
  },
};
