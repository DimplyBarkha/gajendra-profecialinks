
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'ferguson',
    domain: 'ferguson.com',
    url: 'https://www.ferguson.com/category?Ntt={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
