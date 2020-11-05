
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'mifarma',
    domain: 'mifarma.es',
    url: 'https://www.mifarma.es/catalogsearch/result/?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
