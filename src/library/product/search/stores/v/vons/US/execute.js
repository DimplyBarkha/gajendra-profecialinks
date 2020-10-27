
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'vons',
    domain: 'vons.com',
    url: 'https://www.vons.com/shop/search-results.html?q={searchTerms}',
    loadedSelector: '#search-grid_0 > div.row.gutters-items-v2.grid-wrapper.product-grid-v2 > product-item-v2',
    noResultsXPath: null,
    zipcode: '',
  },
};
