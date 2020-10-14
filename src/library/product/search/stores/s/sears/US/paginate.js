
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'sears',
    nextLinkSelector: 'a[title~=Go to next page]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#gallery-table ng-scope',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'sears.com',
    zipcode: "''",
  },
};
