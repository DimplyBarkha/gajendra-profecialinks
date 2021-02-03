
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'canadiantire',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.search-results-grid__content, div.pdp-product-image-and-buy-box__inner.general-product',
    noResultsXPath: '//span[@class="g-s-no-results__top-message-heading-text"]',
    openSearchDefinition: null,
    domain: 'canadiantire.ca',
    zipcode: '',
  },
};
