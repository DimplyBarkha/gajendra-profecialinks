
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles_electronica',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/search/1/?s={searchTerms}',
    loadedSelector: 'ul.c12.products_list._four',
    noResultsXPath: 'div.products_list-container._no_products.vp',
  },
};