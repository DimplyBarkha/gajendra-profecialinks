
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'primor',
    domain: 'primor.eu',
    url: 'https://www.primor.eu/buscar?controller=search&orderby=position&orderway=desc&search_query=fix%20anti-frizz%20techni%20art%20250ml&submit_search=',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
