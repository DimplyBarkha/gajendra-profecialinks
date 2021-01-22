
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'bestbuy',
    domain: 'bestbuy.ca',
    url: 'https://www.bestbuy.ca/fr-ca/chercher?search={searchTerms}',
    loadedSelector: 'div[class*="productsRow"]',
    noResultsXPath: '//h1[@data-automation="no-result-title"]',
    zipcode: '',
  },
};
