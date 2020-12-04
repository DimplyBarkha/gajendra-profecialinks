
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'bloomingdales',
    domain: 'bloomingdales.com',
    url: 'https://www.bloomingdales.com/shop/search?keyword={searchTerms}',
    loadedSelector: 'div[class="sortableGrid"]',
    noResultsXPath: '//div[@class="zeroResultsSearchMessage"]',
    zipcode: '',
  },
};
