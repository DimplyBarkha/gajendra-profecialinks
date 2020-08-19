
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'johnlewis',
    domain: 'johnlewis.com',
    url: 'https://www.johnlewis.com/search?search-term={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//h1[@class="cms-no-results-heading"]',
    zipcode: '',
  },
};
