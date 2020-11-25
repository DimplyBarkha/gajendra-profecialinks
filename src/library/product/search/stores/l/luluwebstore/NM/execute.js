
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NM',
    store: 'luluwebstore',
    domain: 'luluhypermarket.com',
    url: 'https://www.luluhypermarket.com/en-ae/search/?text={searchTerms}%3Arelevance',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
