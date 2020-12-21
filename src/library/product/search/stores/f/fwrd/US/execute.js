
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'fwrd',
    domain: 'fwrd.com',
    url: 'https://www.fwrd.com/category-shoes/3f40a9/?navsrc=main&sortBy=popularity',
    loadedSelector: '#plp-product-list ul.product-grids li',
    noResultsXPath: null,
    zipcode: '',
  },
};
