
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'lulu',
    domain: 'luluhypermarket.com',
    url: 'https://www.luluhypermarket.com/en-ae/search/?text={searchTerms}%3Arelevance',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
