
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'adoreBeauty',
    nextLinkSelector: '.ais-InfiniteHits > button:not([disabled])',
    mutationSelector: 'ol.ais-InfiniteHits-list',
    spinnerSelector: null,
    loadedSelector: 'li.ais-InfiniteHits-item',
    noResultsXPath: '//p[contains(text(),"Found 0 products")]',
    openSearchDefinition: null,
    domain: 'adorebeauty.com.au',
    zipcode: "''",
  },
};
