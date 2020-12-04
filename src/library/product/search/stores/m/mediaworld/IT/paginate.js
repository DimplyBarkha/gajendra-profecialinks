
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    // nextLinkSelector: null,
    // nextLinkSelector: 'span .pagination .bottom > span .next',
    // nextLinkSelector: 'span[class="next round-border"]',
    // nextLinkSelector: 'span[class="pagination top"] span[class="round-border next"]',
    nextLinkSelector: null,
    mutationSelector: null,
    // spinnerSelector: 'div[class="spinner-loader-mm"]',
    spinnerSelector: null,
    // loadedSelector: null,
    // noResultsXPath: null,
    loadedSelector: 'div[class="search-product-list-content display-mode-list active"]',
    noResultsXPath: '//h3[class="search-product-widget-title red-highlight"]',
    openSearchDefinition: null,
    domain: 'mediaworld.it',
    zipcode: '',
  },

};
