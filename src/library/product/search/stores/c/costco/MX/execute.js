
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'costco',
    domain: 'costco.com.mx',
    url: 'https://www.costco.com.mx/search?text={searchTerms}',
    loadedSelector: 'ul[class="product-listing product-grid"] li[class*="product-list-item"]',
    noResultsXPath: '//*[contains(@class,"headline")][contains(.,"No se encontraron resultados para")]',
    zipcode: '',
  },
};
