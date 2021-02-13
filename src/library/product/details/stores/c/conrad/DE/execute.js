
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'conrad',
    domain: 'conrad.de',
    loadedSelector: null,
    noResultsXPath: '//h1[contains(text(), "Ihre Suche nach")] | //h1[contains(text(), "404 - Seite nicht gefunden")]',
    zipcode: '',
  },
};
