
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'neimanmarcus',
    domain: 'neimanmarcus.com',
    url: 'https://www.neimanmarcus.com/{queryParams}',
    loadedSelector: '[class*="product-thumbnail"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
