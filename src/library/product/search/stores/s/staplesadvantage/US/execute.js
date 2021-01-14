
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'StaplesAdvantage',
    domain: 'staplesadvantage.com',
    url: 'https://www.staplesadvantage.com/shop/StplCategoryDisplay?term={searchItems}&act=4&src=SRCH&reset=true&boxFinder=',
    loadedSelector: 'span.search-mean-count',
    noResultsXPath: '//div[@class="no-search-container outer-wrap"]',
    zipcode: '',
  },
};
