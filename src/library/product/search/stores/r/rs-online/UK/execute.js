
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'rs-online',
    domain: 'uk.rs-online.com',
    url: 'https://uk.rs-online.com/web/c/?sra=oss&r=t&searchTerm={searchTerms}',
    // url: 'https://uk.rs-online.com/web/c/?sra=oss&r=t&searchTerm=Air%20freshener',
    loadedSelector: 'body',
    noResultsXPath: null,
    zipcode: '',
  },
};
