
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    nextLinkSelector: 'a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#product-item > .product-item-inner .product-image-item img',
    noResultsXPath: '//title[contains(.,"No Results | Teknosa")]',
    openSearchDefinition: null,
    domain: 'teknosa.com',
    zipcode: '',
  },
};
