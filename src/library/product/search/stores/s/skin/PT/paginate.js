
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PT',
    store: 'skin',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#maincontent > div.columns > div.column.main > div.search.results',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'skin.pt',
    zipcode: '',
  },
};
