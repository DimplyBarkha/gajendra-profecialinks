
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'adorebeauty',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'li[class="ais-InfiniteHits-item m-2"]',
    noResultsXPath: '//p[contains(text(), "0 products")]',
    openSearchDefinition: null,
    domain: 'adorebeauty.com.au',
    zipcode: '',
  },
};
