
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'PK',
    store: 'hummart',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#instant-search-results-container',
    noResultsXPath: '//div[@class="no-results"]',
    openSearchDefinition: null,
    domain: 'hummart.pk',
    zipcode: "''",
  },
};