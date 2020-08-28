
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    nextLinkSelector: null,
    // nextLinkSelector: 'div[class^="ProductsList"] button[data-test="mms-search-srp-loadmore"]',
    // nextLinkSelector: 'li.pagination-next a[rel="next"]',
    mutationSelector: null,
    spinnerSelector: null,
    // spinnerSelector: 'div.spinner',
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.mediamarkt.de/de/search.html?page={page}&query={searchTerms}',
    },
    domain: 'mediamarkt.de',
    zipcode: '',
  },
};
