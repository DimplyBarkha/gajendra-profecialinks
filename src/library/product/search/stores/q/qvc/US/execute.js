
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    domain: 'qvc.com',
    url: 'https://www.qvc.com/catalog/search.html?keyword={searchTerms}',
    loadedSelector: 'div[class="productInfo productGallery "]',
    noResultsXPath: '//div[@class="monetate_selectorHTML_bcb1faba"]',
    zipcode: '',
  },
};
