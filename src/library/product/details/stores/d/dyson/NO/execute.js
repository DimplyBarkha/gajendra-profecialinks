
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NO',
    store: 'dyson',
    domain: 'dyson.no',
    loadedSelector: 'div.product-hero.parbase',
    noResultsXPath: '//h3[contains(text(), "Vi beklager, men siden du ser etter finnes ikke")]',
    zipcode: '',
  },
};
