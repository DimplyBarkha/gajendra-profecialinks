
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'hayneedle',
    domain: 'hayneedle.US',
    url: 'https://www.hayneedle.com/search/index.cfm?Ntt={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
