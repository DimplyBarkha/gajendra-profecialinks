
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'linsenmax',
    domain: 'linsenmax.ch',
    loadedSelector: 'article#maincontent',
    noResultsXPath: "//h1[contains(text(),'Hoppla! – Die Seite gibt es nicht')]",
    zipcode: '',
  },
};
