
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'ah',
    domain: 'ah.nl',
    url: 'https://www.ah.nl/zoeken?query={SearchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
