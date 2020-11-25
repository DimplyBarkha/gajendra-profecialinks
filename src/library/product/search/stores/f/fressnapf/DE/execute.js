
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'fressnapf',
    domain: 'fressnapf.de',
    url: 'https://www.fressnapf.de/search/?text={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
