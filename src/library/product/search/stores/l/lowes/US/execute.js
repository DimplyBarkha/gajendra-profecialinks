
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'lowes',
    domain: 'lowes.com',
    url: 'https://www.lowes.com/search?searchTerm={searchTerms}',
    loadedSelector: 'a > span > article > span',
    noResultsXPath: null,
  },
};
