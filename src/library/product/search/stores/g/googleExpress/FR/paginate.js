
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'googleExpress',
    nextLinkSelector: "td[role*='heading'][aria-level*='3'] a[id*='pnnext']",
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//p[contains(@role,'heading') and contains(.,'did not match')]",
    openSearchDefinition: null,
    domain: 'google.fr',
    zipcode: '',
  },
};
