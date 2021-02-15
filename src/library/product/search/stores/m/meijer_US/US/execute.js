
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'meijer_US',
    domain: 'meijer.com',
    url: 'https://www.meijer.com/shop/en/search/?q={searchTerms}&page=0',
    loadedXpath: '//div[@class="product-item"]',
    noResultsXPath: '//div[@class="search-empty row "]',
    zipcode: '',
  },
};