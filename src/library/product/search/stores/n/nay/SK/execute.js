
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SK',
    store: 'nay',
    domain: 'nay.sk',
    url: 'https://www.nay.sk/vysledky-vyhladavanie?do=searchBox-searchForm-submit&q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
