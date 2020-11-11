
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'marionnaud',
    nextLinkSelector: 'a[class="page-link next"]',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'body',
    noResultsXPath: null,
    openSearchDefinition: null,
    domain: 'marionnaud.fr',
    zipcode: '',
  },
};
