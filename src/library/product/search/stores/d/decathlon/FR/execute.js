
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'decathlon',
    domain: 'decathlon.fr',
    url: 'https://www.decathlon.fr/search?Ntt={searchTerms}',
    loadedSelector: 'div#in-product-list',
    noResultsXPath: null,
    zipcode: '',
  },
};
