
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'linsenmax',
    domain: 'linsenmax.ch',
    url: 'https://www.linsenmax.ch/de/{searchTerms}.html',
    loadedSelector: 'ul.productoverview-item-list li.productoverview-item-list__item',
    noResultsXPath: '//h1[contains(text(),"Hoppla! – Die Seite gibt es nicht")]',
    zipcode: "''",
  },
};
