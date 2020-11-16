
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'luluhypermarket',
    domain: 'luluhypermarket.com',
    url: 'https://www.luluhypermarket.com/en-ae/search/?text={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
