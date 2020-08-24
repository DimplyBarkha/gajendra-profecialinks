
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'leons',
    domain: 'leons.ca',
    url: 'https://www.leons.ca/pages/search-results?q={searchTerms}',
    loadedSelector: 'div[class*="findify-layouts--search"]',
    noResultsXPath: '//span[contains(@class,"zero-results")]|//span[contains(text(), "Showing 0 results for")]',
    zipcode: '',
  },
};
