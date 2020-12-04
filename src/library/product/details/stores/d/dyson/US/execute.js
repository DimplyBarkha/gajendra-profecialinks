
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'dyson',
    domain: 'dyson.com',
    loadedSelector: 'div.product-hero.parbase',
    noResultsXPath: '//h3[contains(text(), "the page you\'re looking for can\'t be found")]',
    zipcode: '',
  },
};
