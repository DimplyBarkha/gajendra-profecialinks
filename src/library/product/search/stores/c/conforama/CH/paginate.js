
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'conforama',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section[class="main-section"]',
    noResultsXPath: '//section[@class="main-section emptySearch"]',
    openSearchDefinition: {
      template: 'https://www.conforama.ch/fr/recherche-conforama/{searchTerms}?p={page}',
    },
    domain: 'conforama.ch',
    zipcode: '',
  },
};
