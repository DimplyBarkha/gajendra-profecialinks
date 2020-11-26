
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    nextLinkSelector: 'a[class="pl-Pagination-icon pl-Pagination-icon--next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="BrowseProductCardImage"]>img',
    noResultsXPath: '//div[@class="NoResults-header-copy"]//p',
    openSearchDefinition: null,
    domain: 'wayfair.US',
    zipcode: '',
  },
};
