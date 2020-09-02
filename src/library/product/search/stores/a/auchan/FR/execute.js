
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'auchan',
    domain: 'auchan.fr',
    url: 'https://www.auchan.fr/recherche?text={searchTerms}',
    loadedSelector: 'div.product-list--container.grid',
    noResultsXPath: null,
    zipcode: '',
  },
};
