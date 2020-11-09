
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'Appie',
    domain: 'appie.nl',
    url: 'https://www.ah.nl/zoeken?query={searchTerms}&page=4',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@data-testhook,"search-no-results")]',
    zipcode: '',
  },
};
