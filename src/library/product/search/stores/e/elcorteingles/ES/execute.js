
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/supermercado/buscar/?term={searchTerms}',
    loadedSelector: 'div.product_tile-prices',
    noResultsXPath: '//h5[@class="grid-coincidences"]/span[1][contains(text(), "0")]',
  },
};
