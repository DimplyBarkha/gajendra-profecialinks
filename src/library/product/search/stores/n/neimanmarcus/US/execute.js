
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'neimanmarcus',
    domain: 'neimanmarcus.com',
    url: 'https://www.neimanmarcus.com/{queryParams}',
    loadedSelector: 'div[class*="product-thumbnail grid"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
