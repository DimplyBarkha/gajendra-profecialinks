
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'dyson',
    domain: 'dyson.be',
    loadedSelector: 'div.product-hero',
    noResultsXPath: '//h3[contains(text(), "Sorry, de pagina die je zoekt, is niet gevonden.")]',
    zipcode: '',
  },
};
