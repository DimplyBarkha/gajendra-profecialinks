
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'parfumdreams',
    domain: 'parfumdreams.de',
    url: 'https://en.parfumdreams.de/?m=5&search={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};