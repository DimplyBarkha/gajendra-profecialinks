
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    domain: 'kruidvat.nl',
    // url: 'https://www.kruidvat.nl/search?q=aftersun&text=aftersun&searchType=manual',
    url: 'https://www.kruidvat.nl/search?q={searchTerms}&searchType=manual',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
