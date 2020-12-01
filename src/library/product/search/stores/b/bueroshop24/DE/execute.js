
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'bueroshop24',
    domain: 'bueroshop24.de',
    url: 'https://www.bueroshop24.de/suche/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
