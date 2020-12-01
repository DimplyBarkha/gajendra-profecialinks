
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'RU',
    store: 'ochkarik',
    nextLinkSelector: 'li[class="catalog-pager__item item active next-page"] a',
    nextLinkXpath: '//li[@class="catalog-pager__item item active next-page"]/a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="productsContainer search-container"] div[class="product-grid__wrap "]',
    loadedXpath: '//div[@class="productsContainer search-container"]/div[@class="product-grid__wrap "]',
    noResultsXPath: null,
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'ochkarik.ru',
    zipcode: '',
  },
};
