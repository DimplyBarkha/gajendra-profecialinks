
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'harristeeter_28203',
    domain: 'harristeeter.com',
    // loadedSelector: 'div.product-tabs',
    loadedSelector: 'hts-product-details',
    noResultsXPath: null,
    zipcode: '',
  },
};
