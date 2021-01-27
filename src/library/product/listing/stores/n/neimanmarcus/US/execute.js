
module.exports = {
  implements: 'product/listing/execute',
  parameterValues: {
    country: 'US',
    store: 'neimanmarcus',
    domain: 'neimanmarcus.com',
    loadedSelector: 'div[class*="product-thumbnail"]',
    noResultsXPath: null,
    gotoUrlTemplate: 'https://www.neimanmarcus.com/{queryParams}',
    zipcode: '',
  },
};
