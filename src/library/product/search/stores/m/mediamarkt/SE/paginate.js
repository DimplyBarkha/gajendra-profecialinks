module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'SE',
    store: 'mediamarkt',
    nextLinkSelector: 'li.pagination-next a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: 'div.spinner',
    loadedSelector: 'ul[class="products-list"]',
    noResultsXPath: '//*[@class="no-result"]',
    openSearchDefinition: null,
    domain: 'mediamarkt.se',
    zipcode: '',
  },
};
