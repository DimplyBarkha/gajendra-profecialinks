
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'jbhifi',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.product-tile__image--aspect-ratio>img',
    noResultsXPath: '//*[@class="no-search-result"]',
    openSearchDefinition: null,
    domain: 'jbhifi.com.au',
    zipcode: '',
  },
};
