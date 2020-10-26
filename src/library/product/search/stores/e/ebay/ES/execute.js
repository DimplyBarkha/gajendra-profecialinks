
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'ebay',
    domain: 'ebay.es',
    url: 'http://www.ebaystores.es/Dyson-Oficial?_nkw={searchTerms}&',
    loadedSelector: 'div[class*="rs-pview"]',
    noResultsXPath: '//span[contains(@class, "countClass") and contains(text(), " 0 ")]',
    zipcode: '',
  },
};
