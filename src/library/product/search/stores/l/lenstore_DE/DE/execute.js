
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'lenstore_DE',
    domain: 'www.lenstore.de',
    url: 'https://www.lenstore.de/suchen/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};