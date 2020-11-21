
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RS',
    store: 'maxi',
    domain: 'maxi.rs',
    url: 'https://www.maxi.rs/online/search?q={searchTerms}',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
