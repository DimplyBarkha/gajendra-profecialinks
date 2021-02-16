
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NL',
    store: 'jumbo',
    domain: 'jumbo.com',
    url: 'https://www.jumbo.com/producten/?offSet=0&searchTerms={searchTerms}',
    loadedSelector: 'div[analytics-tag="product list"]',
    noResultsXPath: '//div[@class="error-state-wrapper text-center cl ctr"]',
    zipcode: '',
  },
};
