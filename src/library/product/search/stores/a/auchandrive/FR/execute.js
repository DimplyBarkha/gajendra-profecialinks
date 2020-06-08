
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'auchandrive',
    domain: 'auchandrive.fr',
    url: 'https://www.auchandrive.fr/recherche/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//p[@class="products-empty__title"]',
  },
};
