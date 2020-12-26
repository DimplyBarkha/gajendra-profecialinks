
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'PL',
    store: 'carrefour',
    domain: 'carrefour.pl',
    url: 'https://www.carrefour.pl/szukaj?q={searchTerms}',
    loadedSelector: 'div#__next header + div + div>div',
    noResultsXPath: null,
    zipcode: '',
  },
};
