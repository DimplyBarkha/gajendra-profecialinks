
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'sears',
    nextLinkSelector: 'div.page, ng-scope',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.gallery-table, ng-scope',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'sears.com',
    zipcode: "''",
  },
};
