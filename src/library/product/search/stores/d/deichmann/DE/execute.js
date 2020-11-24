
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'deichmann',
    domain: 'deichmann.com',
    url: "https://www.deichmann.com/de-de/search?text={searchTerms}",
    loadedSelector: ".m-product-list",
    noResultsXPath: "//p[@data-key='core.component.searchPageTemplate.results'][contains(text(),' 0 Ergebnisse ')]",
    zipcode: '',
  },
};
