
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'deichmann',
    nextLinkSelector: "a[rel='next']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: ".m-product-list",
    noResultsXPath: "//p[@data-key='core.component.searchPageTemplate.results'][contains(text(),' 0 Ergebnisse ')]",
    openSearchDefinition: null,
    domain: 'deichmann.com',
    zipcode: '',
  },
};
