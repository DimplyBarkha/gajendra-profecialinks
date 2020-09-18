
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    domain: 'teknosa.com',
    url: 'https://www.teknosa.com/arama/?s={searchTerms}&personaclick_search_query={searchTerms}',
    loadedSelector: 'div[id="js-product-list-grid-view"]',
    noResultsXPath: '//div[@class="alert-box alert-information"]//div[@class="text"]',
    zipcode: '',
  },
};