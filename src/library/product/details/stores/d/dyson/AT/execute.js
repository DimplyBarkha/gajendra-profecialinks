
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'dyson',
    domain: 'dyson.at',
    loadedSelector: 'div.product-hero',
    noResultsXPath: '//h3[contains(text(), "Seite nicht gefunden werden.")]',
    zipcode: '',
  },
};
