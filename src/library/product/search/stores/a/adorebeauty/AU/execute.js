
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'adorebeauty',
    domain: 'adorebeauty.com.au',
    url: null,
    loadedSelector: 'div[class="ais-InfiniteHits"] > ol',
    noResultsXPath: '//div[@class="ais-InfiniteHits"]/ol[not(.//text()[normalize-space()])]',
    zipcode: '',
  },
};
