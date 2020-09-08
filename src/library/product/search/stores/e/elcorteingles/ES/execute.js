
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    domain: 'elcorteingles.es',
    url: 'https://www.elcorteingles.es/supermercado/buscar/?term={searchTerms}&search=text',
    loadedSelector: 'div.product_tile-prices',
    noResultsXPath: '//div[@class="composition _none_sc"] |  //div[contains(@class,"js-plp") and count(div[contains(@class,"js-grid-container")]) < 1]',
  },
};
