
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'bell',
    domain: 'bell.ca',
    url: 'https://www.bell.ca/search#q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="coveo-show-if-no-results" and contains(@style,"block")]',
    zipcode: '',
  },
};
