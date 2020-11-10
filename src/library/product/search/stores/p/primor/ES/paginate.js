
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'primor',
    nextLinkSelector: '[id="pagination_next_bottom"] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#center_column > ul > li',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'primor.eu',
    zipcode: '',
  },
  openSearchDefinition : {
    template: 'https://www.primor.eu/buscar?controller=search&orderby=position&orderway=desc&search_query={searchTerms}&submit_search=#/page-{page}',
  },
};
