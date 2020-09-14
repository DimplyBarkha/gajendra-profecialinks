
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'eprice',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: "//div[contains(text(), 'Nessun risultato trovato per')]",
    openSearchDefinition: {
      template: 'https://www.eprice.it/sa/?qs={searchTerms}&page={page}',
    },
    domain: 'eprice.it',
    zipcode: '',
  },
};
