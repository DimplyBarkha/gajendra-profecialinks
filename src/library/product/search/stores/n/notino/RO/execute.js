
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RO',
    store: 'notino',
    domain: 'notino.ro',
    url: 'https://www.notino.ro/search.asp?exps={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
