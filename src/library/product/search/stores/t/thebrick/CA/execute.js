
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'thebrick',
    domain: 'thebrick.com',
    url: 'https://www.thebrick.com/pages/search-results?q={searchTerms}',
    loadedSelector: 'div[class*="findify-layouts--search"]',
    noResultsXPath: '//div[@id="findify-zeroResultsWrapper"] | //div[contains(text(), "Sorry, no results were found for")] | //div[@id="findify-query-text"]//h2[contains(text(), "Partial match for")]',
    zipcode: '',
  },
};
