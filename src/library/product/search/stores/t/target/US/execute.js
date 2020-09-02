
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'target',
    domain: 'target.com',
    url: 'https://www.target.com/s?searchTerm={searchTerms}',
    loadedSelector: 'div[data-test="productGridContainer"] li:nth-last-child(1)',
    noResultsXPath: '//h1[contains(.,"no results found")] | //img[@alt="no_or_low_results_icon"]',
    zipcode: '',
  },
};
