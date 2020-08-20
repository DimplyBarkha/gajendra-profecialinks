
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'conforama',
    // nextLinkSelector: 'div[class="ctrl-navigation ctrl-next"] a',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'section[class="main-section"]',
    noResultsXPath: '//section[@class="main-section emptySearch"]',
    openSearchDefinition: {
      template: 'https://www.carrefour.fr/s?q={searchTerms}&page={page}',
    },
    domain: 'conforama.fr',
    zipcode: '',
  },
};
