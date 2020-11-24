
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CL',
    store: 'tottus',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.productList li.product',
    loadedXpath: null,
    noResultsXPath: '//div[@class="error-image"]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.tottus.cl/buscar?q={searchTerms}&page={page}',
      pageOffset: 0,
      pageStartNb: 1,
    },
    domain: 'tottus.cl',
    zipcode: "''",
  },
};
