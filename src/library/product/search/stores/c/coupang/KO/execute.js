
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'KO',
    store: 'coupang',
    domain: 'coupang.com',
    url: 'https://www.coupang.com/np/search?q={searchTerms}&channel=recent',
    loadedSelector: 'div.search-content.search-content-with-feedback  ul#productList',
    noResultsXPath: '//div[@class="search-content search-content-with-feedback search-empty-content"]//p//span[@class="message"]',
    zipcode: '',
  },
};
