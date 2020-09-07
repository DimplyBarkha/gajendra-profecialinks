
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/supermercado/buscar/?term={searchTerms}&search=text',
    loadedSelector: 'div.product_tile-prices',
    noResultsXPath: '//div[@class="composition _none_sc"]',
  },
};
