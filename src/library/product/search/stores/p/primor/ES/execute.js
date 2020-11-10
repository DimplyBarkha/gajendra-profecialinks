
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'primor',
    domain: 'primor.eu',
    url: 'https://www.primor.eu/buscar?controller=search&orderby=position&orderway=desc&search_query={searchTerms}&submit_search=',
    loadedSelector: '#center_column > ul > li',
    noResultsXPath: null,
    zipcode: '',
  },
};
