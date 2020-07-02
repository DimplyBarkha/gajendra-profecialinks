
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'carrefourBodega',
    domain: 'carrefour.es',
    loadedSelector: "div[class*='image easyzoom'] img",
    noResultsXPath: "//h1[@id='search_results' and contains(.,'(0)')]",
    zipcode: '',
  },
};
