
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'stakelums',
    domain: 'stakelums.ie',
    // url: 'https://www.stakelums.ie/search/?query={searchTerms}',
    url: 'https://www.stakelums.ie/search/keywords/?keywords={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
