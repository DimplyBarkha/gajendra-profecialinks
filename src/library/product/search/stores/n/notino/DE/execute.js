
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'notino',
    domain: 'notino.de',
    url: 'https://www.notino.de/search.asp?exps={searchTerms}',
<<<<<<< HEAD
    // url: 'https://www.notino.de/search.asp?exps=frizz',
=======
>>>>>>> 1cc515a801935b3beb417412e31a80208a2e4471
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
