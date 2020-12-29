
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'adoreBeauty',
    domain: 'adorebeauty.com.au',
    url: 'https://www.adorebeauty.com.au/results?q={searchTerms}',
    loadedSelector: 'li.ais-InfiniteHits-item',
    noResultsXPath: '//p[contains(text(),"Found 0 products")]',
    zipcode: "''",
  },
};
