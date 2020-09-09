module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    domain: 'fust.ch',
    url: 'https://www.fust.ch/de/search.html?searchtext={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
