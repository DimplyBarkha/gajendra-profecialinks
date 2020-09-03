
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'manor',
    domain: 'manor.ch',
    url: 'https://www.manor.ch/search/text#/q/{searchTerms}',
    loadedSelector: 'div#epoq_resultrows',
    noResultsXPath: '//span[contains(text(),"Leider konnten wir kein Ergebnis für Sie finden.")]',
    zipcode: "''",
  },
};
