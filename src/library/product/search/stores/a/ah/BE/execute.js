
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    domain: 'ah.be',
    url: 'https://www.ah.be/zoeken?query={SearchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
