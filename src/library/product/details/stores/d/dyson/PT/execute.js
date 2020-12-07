
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PT',
    store: 'dyson',
    domain: 'dyson.pt',
    loadedSelector: 'div.product-hero.parbase',
    noResultsXPath: '//h3[contains(text(), "Lamentamos, mas não é possível encontrar a página que procura.")]',
    zipcode: '',
  },
};
