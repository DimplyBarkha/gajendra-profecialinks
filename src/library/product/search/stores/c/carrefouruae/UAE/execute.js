
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UAE',
    store: 'carrefouruae',
    domain: 'carrefouruae.com',
    url: 'https://www.carrefouruae.com/v3/search?keyword={searchTerms}',
    loadedSelector: 'p[data-testid="page-info-content"]',
    noResultsXPath: '//h2[@data-testid="no-result-text"]',
    zipcode: '',
  },
};
