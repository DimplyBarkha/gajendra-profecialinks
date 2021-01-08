module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'fwrd',
    domain: 'fwrd.com',
    url: 'https://www.fwrd.com/{queryParams}',
    loadedSelector: '#plp-product-list ul.product-grids li',
    noResultsXPath: null,
    zipcode: '',
  },

};
