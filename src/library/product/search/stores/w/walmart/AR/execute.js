module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AR',
    timeout: 50000,
    store: 'walmart',
    domain: 'walmart.com.ar',
    url: 'https://www.walmart.com.ar/buscar?text={searchTerms}',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="u-center"]',
  },
};
