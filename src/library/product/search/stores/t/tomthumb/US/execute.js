
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'tomthumb',
    domain: 'tomthumb.com',
    url: 'https://www.tomthumb.com/shop/search-results.html?q={searchTerms}',
    loadedSelector: '#search-grid_0 > div.row.gutters-items-v2.grid-wrapper.product-grid-v2',
    noResultsXPath: null,
    zipcode: '75023',
  },
};
