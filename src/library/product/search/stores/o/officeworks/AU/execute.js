
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'officeworks',
    domain: 'officeworks.com.au',
    url: 'https://www.officeworks.com.au/shop/officeworks/search?q={searchTerms}',
    loadedSelector: 'div[data-ref="tile-grid-container"]',
    noResultsXPath: '//div[@data-ref="search-no-results"]',
    zipcode: '',
  },
};
