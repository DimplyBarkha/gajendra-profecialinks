
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    domain: 'carrefour.fr',
    url: 'https://www.carrefour.fr/s?q={searchTerms}',
    loadedSelector: 'section[class="side-template__section"]',
    noResultsXPath: '//div[@class="error-block"]/div | //div[contains(@class, "search-results-head__title search-results-head__title--no-result")]',
    zipcode: '',
  },
};
