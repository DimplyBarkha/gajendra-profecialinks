
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'canadiantire',
    domain: 'canadiantire.ca',
    url: 'https://www.canadiantire.ca/en/search-results.html?q={searchTerms}',
    loadedSelector: 'div[data-component="ProductTileSrp"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
