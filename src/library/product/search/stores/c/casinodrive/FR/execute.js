
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'casinodrive',
    domain: 'casinodrive.fr',
    url: 'https://plus.casino.fr/products/search?q={searchTerms}',
    loadedSelector: 'div[data-synthetics="product-list"]',
    noResultsXPath: '//main/div[@data-test="no-products-page"]',
    zipcode: '',
  },
};
