
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'BR',
    store: 'riachuelo',
    nextLinkSelector: 'div.product-list > button',
    // mutationSelector: null,
    spinnerSelector: 'div.loading-mask[style*="display: block;"] > div',
    loadedSelector: 'ol>li.product-list__item',
    noResultsXPath: '//p[@class="product-list__warning"]',
    // openSearchDefinition: null,
    domain: 'riachuelo.com.br',
    zipcode: '',
  },
};
