module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'walmart',
    domain: 'walmart.com.mx',
    url: 'https://www.walmart.com.mx/productos?Ntt={searchTerms}',
    loadedSelector: 'div[data-testid="products-grid"]',
    noResultsXPath: '//*[@data-automation-id="no-result-text"]',
    zipcode: '',
  },
};
