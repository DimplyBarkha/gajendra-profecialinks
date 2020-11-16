
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'bws',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[contains(class,"search-zero-results-wrapper text-center")]',
    openSearchDefinition: null,
    domain: 'bws.com.au',
    zipcode: "''",
  },
};
