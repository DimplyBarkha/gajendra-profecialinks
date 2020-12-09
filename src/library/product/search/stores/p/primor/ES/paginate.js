
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'ES',
    store: 'primor',
    nextLinkSelector: '[id="pagination_next_bottom"] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[id="center_column"]',
    noResultsXPath: null,
    // openSearchDefinition: {
    //   template: 'https://www.primor.eu/buscar?controller=search&orderby=position&orderway=desc&search_query={searchTerms}&submit_search=#/page-{page}',
    //   },
    domain: 'primor.eu',
    zipcode: '',
  },
};
