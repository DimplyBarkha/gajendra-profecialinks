
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NO',
    store: 'kolonial',
    domain: 'kolonial.no',
    url: 'https://kolonial.no/sok/?q={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
