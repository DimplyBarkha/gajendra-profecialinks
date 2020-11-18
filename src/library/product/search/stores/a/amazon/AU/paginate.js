
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'amazon',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.s-main-slot.s-result-list.s-search-results.sg-row',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'amazon.com.au',
    zipcode: "''",
  },
};
