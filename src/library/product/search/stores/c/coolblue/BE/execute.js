
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    domain: 'coolblue.be',
    url: 'https://www.coolblue.be/nl/zoeken?query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
