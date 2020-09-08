
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'perfecthair',
    domain: 'perfecthair.ch',
    url: 'https://www.perfecthair.ch/de/search?sSearch={searchTerms}',
    loadedSelector: '.listing--container',
    noResultsXPath: '//div[@class = "alert--content" and contains(text(), "Suchanfrage keine Artikel gefunden")]',
    zipcode: '',
  },
};
