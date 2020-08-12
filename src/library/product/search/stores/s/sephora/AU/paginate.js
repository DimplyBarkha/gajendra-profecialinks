
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'sephora',
    nextLinkSelector: 'nav[aria-label="Pagination"] button[aria-label="Next"]:not([disabled])',
    // mutationSelector: null,
    // spinnerSelector: 'div[data-comp="Interstice Loader "]:not([style="display:none"])',
    loadedSelector: '//div[@class="products-grid"]//div[contains(@class,"product-item")]',
    // noResultsXPath: '//h1[contains(., "0 Product results")]',
    // openSearchDefinition: null,
    domain: 'sephora.com',
    zipcode: '',
  },
};
