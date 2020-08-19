
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'backmarket',
    domain: 'backmarket.fr',
    url: 'https://www.backmarket.fr/search/?q={searchTerms}',
    loadedSelector: 'section[data-test="product-results-refinement"]',
    noResultsXPath: '//div[@data-test="search-landing-no-result"]',
    zipcode: '',
  },
};
