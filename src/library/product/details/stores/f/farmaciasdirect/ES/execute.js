
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'farmaciasdirect',
    domain: 'farmaciasdirect.com',
    loadedSelector: 'div.product-img img',
    noResultsXPath: "//section[contains(@class,'page-not-found')] | //font[contains(text(),'Sorry for the inconvenience')]",
    zipcode: '28001',
  },
};
