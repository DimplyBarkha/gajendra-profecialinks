
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'staplesadvantage',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[aria-label="Search Results"] div[class*="grid__row"] > div',
    noResultsXPath: '//p[@class="NullPage__tryAgainMessage"]',
    openSearchDefinition: {
      template: 'https://www.staplesadvantage.com/search?pn={page}&term={searchTerms}',
    },
    domain: 'staplesadvantage.com',
    zipcode: '',
  },
};
