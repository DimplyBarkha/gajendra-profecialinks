
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'fust',
    domain: 'fust.ch',
    url: 'https://www.fust.ch/de/search.html?searchtext={searchTerms}',
    loadedSelector: 'ul.results  div.product',
    noResultsXPath: '//p[contains(text(),"Es konnte für Ihre Suche leider keine passenden Ergebnisse gefunden werden.")]',
    zipcode: "''",
  },
};
