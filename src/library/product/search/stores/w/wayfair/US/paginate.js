
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    nextLinkSelector: 'a.pl-Pagination-icon--next',
    loadedSelector: '.BrowseProductCardImage',
    noResultsXPath: 'h2.NoResults-title',
    domain: 'wayfair.com',
  },
};
