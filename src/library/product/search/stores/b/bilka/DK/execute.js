
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DK',
    store: 'bilka',
    domain: 'bilka.dk',
    url: 'https://www.bilka.dk/search/?q={searchTerms}',
    loadedSelector: 'div[id="search-view"]',
    noResultsXPath: '//div[contains(@class, "no-results")]',
    zipcode: '',
  },
};
