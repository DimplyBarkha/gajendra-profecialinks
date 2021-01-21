
module.exports = {
  implements: 'product/listing/execute',
  parameterValues: {
    country: 'US',
    store: 'juul',
    domain: 'juul.com',
    loadedSelector: 'div.product-page--single',
    noResultsXPath: null,
    gotoUrlTemplate: null,
    // gotoUrlTemplate: 'https://www.juul.com/shop/pods/{queryParams}',
    zipcode: '',
  },
};
