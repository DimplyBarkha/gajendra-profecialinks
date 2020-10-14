
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'bell',
    nextLinkSelector: 'div[class="CoveoLoadMore"] button',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="serp-result-rating"]',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'bell.ca',
    zipcode: '',
  },
};
