
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'campoluzenoteca',
    domain: 'campoluzenoteca.com',
    url: 'https://www.campoluzenoteca.com/buscar?controller=search&orderby=position&orderway=desc&search_query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
