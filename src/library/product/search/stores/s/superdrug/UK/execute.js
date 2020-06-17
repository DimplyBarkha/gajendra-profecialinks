
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    domain: 'superdrug.com',
    url: 'https://www.superdrug.com/search?text={searchTerms}',
    loadedSelector: 'ul.plp__product-container li:nth-last-child(1) span.bv-off-screen:nth-last-child(1)',
    noResultsXPath: null,
  },
};
