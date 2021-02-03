
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'AE',
    store: 'carrefour',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null, //'div.loader-container div',
    loadedSelector: 'ul[data-testid="scrollable-list-view"] div.ltr-jyyiad',
    noResultsXPath: '//h2[@data-testid="no-result-text"]',
    openSearchDefinition: null,
    domain: 'carrefouruae.com',
    zipcode: "''",
  },
};
