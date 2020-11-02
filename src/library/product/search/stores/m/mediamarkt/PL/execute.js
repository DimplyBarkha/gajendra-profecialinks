module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'mediamarkt',
    domain: 'mediamarkt.pl',
    url: 'https://mediamarkt.pl/search?query%5Bmenu_item%5D=&query%5Bquerystring%5D={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
