
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'shoppersdrugmart',
    domain: 'shoppersdrugmart.ca',
    url: 'https://www.lowes.ca/search?query={searchTerms}',
    loadedSelector: 'img[class="productTileImage"]',
    noResultsXPath: '//div[@class="empty-search"]',
    zipcode: '',
  },
};
