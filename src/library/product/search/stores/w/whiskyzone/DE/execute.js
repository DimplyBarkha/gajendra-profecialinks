
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'whiskyzone',
    domain: 'whiskyzone.de',
    url: 'https://www.whiskyzone.de/search?sSearch={searchTerms}',
    loadedSelector: 'div.listing--container',
    noResultsXPath: null,
    zipcode: '',
  },
};
