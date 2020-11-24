
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'lenstore',
    nextLinkSelector: 'a[class="_pagination__link _pagination__link--next "]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    resultsDivSelector: null,
    openSearchDefinition: null,
    domain: 'lenstore.fr',
    zipcode: '',
  },
};
