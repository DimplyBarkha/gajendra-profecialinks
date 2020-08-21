
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'adorebeauty',
    domain: 'adorebeauty.com.au',
    url: 'https://www.adorebeauty.com.au/results?q={searchTerms}',
    loadedSelector: 'div[class="ais-InfiniteHits"] > ol',
    noResultsXPath: '//div[@class="ais-InfiniteHits"]/ol[not(.//text()[normalize-space()])]',
    zipcode: '',
  },
};
