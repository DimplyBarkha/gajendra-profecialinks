
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'finishline',
    domain: 'finishline.com',
    url: 'https://www.finishline.com/store/_/N-/Ntt-{searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
