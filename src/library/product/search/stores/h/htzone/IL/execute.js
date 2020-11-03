
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IL',
    store: 'htzone',
    domain: 'htzone.co.il',
    url: 'https://www.htzone.co.il/search-result?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
