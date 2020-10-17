
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'whiskyzone',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div.listing--container',
    noResultsXPath: '//div[@class="alert--content" and normalize-space()="Leider wurden zu Ihrer Suchanfrage keine Artikel gefunden"]/text()',
    openSearchDefinition: null,
    domain: 'whiskyzone.de',
    zipcode: '',
  },
};
