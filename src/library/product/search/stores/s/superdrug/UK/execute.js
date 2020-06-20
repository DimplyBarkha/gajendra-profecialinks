
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    domain: 'superdrug.com',
    url: 'https://www.superdrug.com/search?text={searchTerms}',
    loadedSelector: '[class="bv-off-screen"]',
    noResultsXPath: '//div[@id="no_results"]',
  },
};
