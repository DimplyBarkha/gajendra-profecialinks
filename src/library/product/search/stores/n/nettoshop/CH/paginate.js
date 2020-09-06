
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'nettoshop',
    nextLinkSelector: 'a[rel="next"]',
    mutationSelector: null, // 'div.c-product-grid__header-left'
    spinnerSelector: null,
    loadedSelector: 'div.c-product-grid__header-left',
    noResultsXPath: '//div[@class="c-search-result ember-view"]',
    openSearchDefinition: null,
    domain: 'nettoshop.ch',
    zipcode: '',
  },
};
