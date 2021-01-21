
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'FR',
    store: 'microspot',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '#container-productlist > div:last-child img',
    noResultsXPath: '//*[contains(text(),"Tipps für Ihre Suche:")]',
    openSearchDefinition: {
      template: 'https://www.microspot.ch/fr/search?search={searchTerms}&page={page}',
    },
    domain: 'microspot.ch/fr',
    zipcode: '',

  },
};
