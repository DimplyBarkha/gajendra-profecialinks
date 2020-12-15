
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'manor',
    domain: 'manor.ch',
    url: 'https://www.manor.ch/fr/search/text#/q/{searchTerms}',
    loadedSelector: 'div#epoq_resultrows div.epoq_resultrow',
    noResultsXPath: '//p[contains(text(),"Nous n’avons malheureusement trouvé aucun résultat. L’article que vous recherchez n’est peut-être pas disponible en ligne actuellement")]',
    zipcode: "''",
  },
};
