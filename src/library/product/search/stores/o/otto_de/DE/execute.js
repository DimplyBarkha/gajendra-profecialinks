
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'otto_de',
    domain: 'otto.de',
    url: 'https://www.otto.de/suche/{searchTerms}/',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};