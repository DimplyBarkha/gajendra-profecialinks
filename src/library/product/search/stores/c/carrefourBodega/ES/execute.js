
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'carrefourBodega',
    domain: 'carrefour.es',
    url: 'https://www.carrefour.es/bodega/c?Ntt={searchTerms}',
    loadedSelector: "div[class*='item-page'] article.item",
    noResultsXPath: "//h1[@id='search_results' and contains(.,'(0)')]",
    zipcode: '',
  },
};
