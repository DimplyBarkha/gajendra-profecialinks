
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'costco',
    nextLinkSelector: 'a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#list-view-id > li > .product-image > a.thumb > img',
    noResultsXPath: '//span[contains(.,"No se encontraron resultados para")]',
    openSearchDefinition: null,
    domain: 'costco.com.mx',
    zipcode: '',
  },
};
