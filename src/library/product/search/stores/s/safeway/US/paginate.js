
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'safeway',
    nextLinkSelector: '#search-grid_0 > div.col-xs-12.col-sm-12.col-md-12.bloom-load-wrapper > button',
    domain: 'safeway.com',
  },
};
