
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    domain: 'mediaworld.it',
    url: 'https://www.mediaworld.it/search/{searchTerms}',
    // loadedSelector: null,
    // noResultsXPath: null,
    loadedSelector: 'div[class="search-product-list-content display-mode-list active"]',
    noResultsXPath: '//h3[class="search-product-widget-title red-highlight"]',
    zipcode: '',
  },
};
