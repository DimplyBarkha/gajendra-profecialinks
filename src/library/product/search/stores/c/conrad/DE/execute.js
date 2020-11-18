
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'conrad',
    domain: 'conrad.de',
    url: 'https://www.conrad.de/de/search.html?search={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
