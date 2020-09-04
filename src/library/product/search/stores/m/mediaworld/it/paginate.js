
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'it',
    store: 'mediaworld',
    nextLinkSelector: "div.search-product-list.js-comp.active>div.search-product-list-options.clearfix>span.pagination.top>span.round-border.next",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.main-content.is-search-page',
    noResultsXPath: '//div[@class="search-product-widget search-empty"]',
    openSearchDefinition: null,
    domain: 'mediaworld.it',
    zipcode: '',
  },
};
