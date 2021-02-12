
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'countdown',
    domain: 'countdown.co.nz',
    url: 'https://shop.countdown.co.nz/shop/searchproducts?search={searchTerms}&page=1&size=120',
    loadedSelector: '//wnz-search[@class="ng-star-inserted"]',
    noResultsXPath: '//search-no-results[@class="ng-star-inserted"]',
    zipcode: '',
  },
};
