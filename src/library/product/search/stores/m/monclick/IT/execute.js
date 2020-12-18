
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'monclick',
    domain: 'monclick.it',
    url: 'https://www.monclick.it/Catalogo/SearchDispatcher.axd?testo={searchTerms}',
    // line:''
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
