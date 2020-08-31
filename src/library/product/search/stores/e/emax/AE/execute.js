
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AE',
    store: 'emax',
    domain: 'emaxme.com',
    url: 'https://www.emaxme.com/s001/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'div[class*="wrapper grid"]',
    noResultsXPath: '//div[contains(@class, "column main") and not(div[@class="search results"])]',
    zipcode: '',
  },
};
