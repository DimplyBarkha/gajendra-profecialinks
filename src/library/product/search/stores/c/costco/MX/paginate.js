
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'costco',
    nextLinkSelector: 'ul[class*="pagination"] li[class="page-item"] button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class="product-listing product-grid"] li[class*="product-list-item"]',
    noResultsXPath: '//*[contains(@class,"headline")][contains(.,"No se encontraron resultados para")]',
    openSearchDefinition: null,
    domain: 'costco.com.mx',
    zipcode: '',
  },
};
