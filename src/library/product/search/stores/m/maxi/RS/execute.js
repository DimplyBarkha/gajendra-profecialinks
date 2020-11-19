
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'RS',
    store: 'maxi',
    domain: 'maxi.rs',
    url: 'https://www.maxi.rs/online/search?q={searchTerms}:relevance&text=something&sort=relevance&pageNumber=0',
    loadedSelector: 'div[data-testid="search-results-list-wrapper"]',
    noResultsXPath: '//div[@class="sc-3brks3-2 iyGbUN"]',
    zipcode: '',
  },
};
