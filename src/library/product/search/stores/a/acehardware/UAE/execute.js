
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'UAE',
    store: 'acehardware',
    domain: 'aceuae.com',
    url: 'https://www.aceuae.com/en-AE/search/?q={searchTerms}',
    loadedXPath: '//div[contains(@class,"row-cols")]/div[@class="col"]',
    noResultsXPath: '//div[@class="search-no-result"]',
    zipcode: '',
  },
};
