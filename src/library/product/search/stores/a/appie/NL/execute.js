
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'appie',
    domain: 'appie.nl',
    url: 'https://www.ah.nl/zoeken?query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@data-testhook,"search-no-results")]',
    zipcode: '',
  },
};
