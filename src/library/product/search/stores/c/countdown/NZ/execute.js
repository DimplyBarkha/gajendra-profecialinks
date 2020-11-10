
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'countdown',
    domain: 'countdown.co.nz',
    url: 'https://shop.countdown.co.nz/shop/searchproducts?search={searchTerms}',
    loadedSelector: '//wnz-search[@class="ng-star-inserted"]',
    noResultsXPath: '//search-no-results[@class="ng-star-inserted"]',
    zipcode: '',
  },
};
