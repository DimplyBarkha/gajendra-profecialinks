
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CH',
    store: 'haar-shop',
    domain: 'haar-shop.ch',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"cs-messages")]//h3[contains(text(),"Keine Ergebnisse für Suchanfrage")]',
    zipcode: '',
  },
};
