
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CA',
    store: 'costco',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: null,
    openSearchDefinition: {
      template: 'https://www.costco.ca/CatalogSearch?currentPage={page}&dept=All&keyword={searchTerms}',
    },
    domain: 'costco.ca',
    zipcode: '',
  },
};
