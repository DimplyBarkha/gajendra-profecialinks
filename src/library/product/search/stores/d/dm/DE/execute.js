
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'dm',
    domain: 'dm.de',
    url: 'https://www.dm.de/search?query={searchTerms}&searchType=product',
    loadedSelector: '[data-dmid="product-tile-container"]',
    noResultsXPath: null,
  },
};
