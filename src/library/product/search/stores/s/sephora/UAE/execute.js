
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UAE',
    store: 'sephora',
    domain: 'sephora.ae',
    url: 'https://www.sephora.ae/en/search?q={searchTerms}',
    loadedSelector: null, // 'div.search-result-content',
    noResultsXPath: null,
    zipcode: '',
  },
};
