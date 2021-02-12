
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'coolblue',
    domain: 'coolblue.nl',
    url: 'https://www.coolblue.nl/zoeken?query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
