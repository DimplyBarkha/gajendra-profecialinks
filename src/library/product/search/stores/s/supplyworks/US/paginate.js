
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'supplyworks',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.pure-g.search-result-list-box',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'supplyworks.us',
    zipcode: "''",
  },
};
