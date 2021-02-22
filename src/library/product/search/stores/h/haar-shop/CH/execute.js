
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'haar-shop',
    domain: 'haar-shop.ch',
    url: 'https://www.haar-shop.ch/de/#search:query={searchTerms}',
    loadedSelector: 'ol.products li',
    noResultsXPath: '//h3[contains(text(),"Keine Ergebnisse für Suchanfrage")]',
    zipcode: "''",
  },
};
