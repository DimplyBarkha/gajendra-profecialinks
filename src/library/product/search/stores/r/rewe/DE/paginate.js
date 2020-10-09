
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'rewe',
    nextLinkSelector: 'a.search-service-paginationArrow.search-service-paginationArrowEnabled.search-service-paginationArrowBack',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.search-service-rsPageableProductList.search-service-rsQaPageableProductList',
    noResultsXPath: '//div[@class="search-service-shruggingDude"]',
    openSearchDefinition: null,
    domain: 'shop.rewe.de',
    zipcode: '',
  },
};
