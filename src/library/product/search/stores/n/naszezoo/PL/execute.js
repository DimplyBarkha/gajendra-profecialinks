
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'naszezoo',
    domain: 'naszezoo.pl',
    url: 'https://www.naszezoo.pl/pl/searchquery/{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
