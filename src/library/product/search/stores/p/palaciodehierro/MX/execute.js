
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'palaciodehierro',
    domain: 'elpalaciodehierro.com',
    url: 'https://www.elpalaciodehierro.com/buscar?q={searchTerms}',
    loadedSelector: "div[class*='m-product']",
    noResultsXPath: "//div[contains(@class,'b-search_results-keywords') and contains(.,'No hay resultados para')]",
    zipcode: '',
  },
};
