
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'whiskyzone',
    domain: 'whiskyzone.de',
    url: 'https://www.whiskyzone.de/search?sSearch={searchTerms}',
    loadedSelector: 'div.listing--container',
    noResultsXPath: '//div[@class="alert--content" and normalize-space()="Leider wurden zu Ihrer Suchanfrage keine Artikel gefunden"]/text()',
    zipcode: '',
  },
};
