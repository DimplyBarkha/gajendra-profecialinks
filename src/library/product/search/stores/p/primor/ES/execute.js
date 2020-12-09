
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'primor',
    domain: 'primor.eu',
    url: 'https://www.primor.eu/buscar?controller=search&orderby=position&orderway=desc&search_query={searhTerms}&submit_search=',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
