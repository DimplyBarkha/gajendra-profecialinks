
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'mediaworld',
    nextLinkSelector: "div.is-search-page span.pagination.top span[class='round-border next']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.main-content.is-search-page',
    noResultsXPath: '//div[@class="search-product-widget search-empty"]',
    openSearchDefinition: null,
    domain: 'mediaworld.it',
    zipcode: '',
  },
};
