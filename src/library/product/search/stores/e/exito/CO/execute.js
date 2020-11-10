
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CO',
    store: 'exito',
    domain: 'exito.com',
    url: 'https://www.exito.com/search?_query={searchTerms}',
    loadedSelector: 'div.vtex-search-result-3-x-gallery',
    noResultsXPath: '//h2[contains(@class,"exito-search-result-4-x-notFoundText")]',
    zipcode: "''",
  },
};
