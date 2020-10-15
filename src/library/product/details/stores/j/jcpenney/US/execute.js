
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'jcpenney',
    domain: 'jcpenney.com',
    loadedSelector: 'h1[aria-label="productTitle"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
