
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'conforama',
    // nextLinkSelector: 'div[class="ctrl-navigation ctrl-next"] a',
    mutationSelector: null,
    spinnerSelector: null,
    // loadedSelector: 'div.search-results-head__title', 
    noResultsXPath: '//section[@class="main-section emptySearch"]',
    loadedSelector: 'section#contentSegment',
    openSearchDefinition: {
      template: 'https://www.carrefour.fr/s?q={searchTerms}&page={page}',
    },
    domain: 'conforama.fr',
    zipcode: '',
  },
};
