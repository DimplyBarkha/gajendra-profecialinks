
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'dyson',
    domain: 'dyson.ie',
    loadedSelector: 'div.product-hero.parbase',
    noResultsXPath: '//h3[contains(text(), "the page you\'re looking for can\'t be found")]',
    zipcode: '',
  },
};
