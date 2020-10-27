
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'riachuelo',
    nextLinkSelector: 'div.product-list > button[data-bind]',
    // mutationSelector: null,
    spinnerSelector: 'div.loading-mask[style*="display: block;"] > div',
    loadedSelector: 'ol.product-list__items',
    noResultsXPath: '//p[@class="product-list__warning"]',
    // openSearchDefinition: null,
    domain: 'riachuelo.com.br',
    zipcode: '',
  },
};
