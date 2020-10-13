
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'belk',
    nextLinkSelector: 'a[class="page-next"]>i',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'li[data-tile-pid], h1[class="search-result-data"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'belk.com',
    zipcode: '',
  },
};
