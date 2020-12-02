
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'retravision',
    domain: 'retravision.com.au',
    url: 'https://www.retravision.com.au/search?query={searchTerms}',
    loadedSelector: 'div.container > div.ais-InstantSearch',
    noResultsXPath: '//div[@class="no-results"]',
    zipcode: '',
  },
};
