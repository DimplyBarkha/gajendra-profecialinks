
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'canadiantire',
    domain: 'canadiantire.ca/fr.html',
    url: 'https://www.canadiantire.ca/fr/resultats-de-recherche.html?q={searchTerms}',
    loadedSelector: 'div[class="search-results-grid__content"] div[class="temporary-grid-item"]',
    noResultsXPath: '//span[@class="g-s-no-results__top-message-heading-text"]',
    zipcode: '',
  },
};
