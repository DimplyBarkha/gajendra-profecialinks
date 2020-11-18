
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'bringmeister',
    domain: 'bringmeister.de',
    url: 'https://www.bringmeister.de/catalogsearch/results?q={searchTerms}',
    // url: 'https://www.bringmeister.de/catalogsearch/results?q=water',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
