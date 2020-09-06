
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SA',
    store: 'virginmegastore',
    domain: 'virginmegastore.se',
    url: 'https://www.virginmegastore.sa/en/search/?text={searchTerms}',
    loadedSelector: 'ul.product-listing.product-list__item-wrapper',
    noResultsXPath: '//h2[@class="search-empty__headline text-center"]',
    zipcode: '',
  },
};
