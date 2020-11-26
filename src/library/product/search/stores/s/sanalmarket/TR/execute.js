
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'sanalmarket',
    domain: 'migros.com.tr',
    url: 'https://www.migros.com.tr/arama?q={searchTerms}',
    loadedSelector: 'img.product-card-image.lozad',
    noResultsXPath: '//div[@class="empty-search-state"]//span[@class="empty-search-message"]',
    zipcode: '',
  },
};
