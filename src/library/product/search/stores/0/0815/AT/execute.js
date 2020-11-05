
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AT',
    store: '0815',
    domain: '0815.at',
    url: 'https://www.0815.at/search?search={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
