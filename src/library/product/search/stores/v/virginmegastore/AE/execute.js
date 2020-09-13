
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'virginmegastore',
    domain: 'virginmegastore.ae',
    url: 'https://www.virginmegastore.sa/ar/search/?text={searchTerms}',
    loadedSelector: 'ul.product-listing.product-list__item-wrapper',
    noResultsXPath: '//h2[@class="search-empty__headline text-center"]',
    zipcode: '',
  },
};
