
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'thebrick',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="findify-layouts--search"]',
    noResultsXPath: '//div[@id="findify-zeroResultsWrapper"] | //div[contains(text(), "Sorry, no results were found for")] | //div[@id="findify-query-text"]//h2[contains(text(), "Partial match for")]',
    openSearchDefinition: null,
    domain: 'thebrick.com',
    zipcode: '',
  },
};
