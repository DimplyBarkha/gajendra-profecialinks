
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'manor',
    domain: 'manor.ch',
    url: 'https://www.manor.ch/de/search/text#/q/{searchTerms}',
    loadedSelector: 'div#epoq_resultrows div.epoq_resultrow',
    noResultsXPath: '//p[contains(text(),"Leider konnten wir kein Ergebnis für Sie finden. Falls Sie ein Produkt gesucht haben, kann es sein, dass dies derzeit online nicht verfügbar ist")]',
    zipcode: "''",
  },
};
