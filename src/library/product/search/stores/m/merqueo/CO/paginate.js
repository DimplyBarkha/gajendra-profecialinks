
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CO',
    store: 'merqueo',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.main-layout',
    noResultsXPath: null, // '//div[@class="main-layout"][contains(., "No se encontraron resultados")]',
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'merqueo.com',
    zipcode: '',
  },
};
