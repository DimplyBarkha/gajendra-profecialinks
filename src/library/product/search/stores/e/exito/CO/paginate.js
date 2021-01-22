
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'exito',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.vtex-search-result-3-x-gallery',
    noResultsXPath: '//h2[contains(@class,"exito-search-result-4-x-notFoundText")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'exito.com',
    zipcode: "''",
  },
};
