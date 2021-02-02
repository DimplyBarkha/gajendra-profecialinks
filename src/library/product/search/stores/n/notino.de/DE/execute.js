
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    domain: 'notino.de',
    url: 'https://www.notino.de/search.asp?exps={searchTerms}',
    // url: 'https://www.notino.de/search.asp?exps=frizz',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
