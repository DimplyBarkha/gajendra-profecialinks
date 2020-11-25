module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'connection',
    nextLinkSelector: 'div[class="search-navigation-bottom row ExcludeFromEmail"] a[aria-label="Next Page"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      offset: 12,
      template: 'https://www.connection.com/IPA/Shop/Product/Search/?q=1&term={searchTerms}',

    },
    domain: 'connection.com',
    zipcode: '',
  },
};
