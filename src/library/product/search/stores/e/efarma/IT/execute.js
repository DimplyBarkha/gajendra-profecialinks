
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'efarma',
    domain: 'efarma.com',
    url: 'https://www.efarma.com/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'ol.clerk-grid.products-list > li',
    noResultsXPath: '//strong[contains(text(), "La tua ricerca non ha dato risultati ma NON ARRENDERTI!")]',
    zipcode: '',
  },
};
