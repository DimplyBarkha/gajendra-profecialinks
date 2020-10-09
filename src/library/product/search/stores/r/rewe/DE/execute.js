
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'rewe',
    domain: 'shop.rewe.de',
    url: 'https://shop.rewe.de/productList?search={searchTerms}',
    loadedSelector: 'div.search-service-rsPageableProductList.search-service-rsQaPageableProductList',
    noResultsXPath: '//div[@class="search-service-shruggingDude"]',
    zipcode: '',
  },
};
