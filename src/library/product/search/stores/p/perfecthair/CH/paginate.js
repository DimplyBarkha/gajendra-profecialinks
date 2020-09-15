
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'CH',
    store: 'perfecthair',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: '.listing--container',
    noResultsXPath: '//div[@class = "alert--content" and contains(text(), "Suchanfrage keine Artikel gefunden")]',
    openSearchDefinition: {
      template: 'https://www.perfecthair.ch/de/search?sSearch={searchTerms}&p={page}',
    },
    domain: 'perfecthair.ch',
    zipcode: '',
  },
};
