
module.exports = {
  implements: 'product/listing/execute',
  parameterValues: {
    country: 'US',
    store: 'fwrd',
    domain: 'fwrd.com',
    loadedSelector: '#plp-product-list ul.product-grids li',
    noResultsXPath: null,
    gotoUrlTemplate: 'https://www.fwrd.com/{queryParams}',
    zipcode: '',
  },
};
