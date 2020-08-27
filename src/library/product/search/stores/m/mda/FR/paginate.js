
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'mda',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//p[text()="Aucun résultat trouvé"]',
    openSearchDefinition: null,
    domain: 'mda-electromenager.com',
    zipcode: '',
  },
};
