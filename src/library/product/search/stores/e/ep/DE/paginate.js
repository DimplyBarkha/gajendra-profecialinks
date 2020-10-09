module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'dyson',
    noResultsXPath: '//h2[contains(.,"Leider ergab Ihre Suche keine Ergebnisse")]',
    domain: 'ep.de',
    zipcode: '',
  },
};
