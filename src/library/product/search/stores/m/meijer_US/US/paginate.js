
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'meijer_US',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: '//div[@class="product-item"]',
    noResultsXPath: '//div[@class="search-empty row "]',
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      pageStartNb: 0,
      template: 'https://www.meijer.com/shop/en/search/?q={searchTerms}&page={page}',
      },
    domain: 'meijer.com',
    zipcode: '',
  },
};
