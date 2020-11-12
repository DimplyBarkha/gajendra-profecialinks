
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'rs-online',
    domain: 'uk.rs-online.com',
    url: 'https://uk.rs-online.com/web/c/?sra=oss&r=t&limit=100&searchTerm={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
