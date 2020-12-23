module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'fetch',
    domain: 'fetch.co.uk',
    url: 'https://fetch.co.uk/search?entry={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
