
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    domain: 'kruidvat.nl',
    url: 'https://www.kruidvat.nl/search?q=48+uur+werking&text=48+uur+werking&searchType=manual',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
