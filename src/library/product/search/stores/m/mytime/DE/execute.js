
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'mytime',
    domain: 'mytime.de',
    url: 'https://www.mytime.de/search?query={searchTerms}',
    loadedSelector: 'ol.products-list',
    noResultsXPath: '//p[@class="category-view__info"]',
    zipcode: '',
  },
};
