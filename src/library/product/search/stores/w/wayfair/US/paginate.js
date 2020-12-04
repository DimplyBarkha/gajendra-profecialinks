
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    nextLinkSelector: 'a[data-codeception-id="PaginationLinkNext"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.BrowseProductCardImage',
    noResultsXPath: '//h2[@class="NoResults-title"]',
    openSearchDefinition: null,
    domain: 'wayfair.com',
    zipcode: '',
  },
};
