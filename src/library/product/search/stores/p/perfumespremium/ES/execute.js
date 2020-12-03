
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'perfumespremium',
    domain: 'perfumespremium.es',
    url: 'https://www.perfumespremium.es/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div.products-grid',
    noResultsXPath: null,
    zipcode: '',
  },
};
