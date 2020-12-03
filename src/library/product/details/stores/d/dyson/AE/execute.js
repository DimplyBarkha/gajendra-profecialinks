
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'dyson',
    domain: 'dyson.ae',
    loadedSelector: 'div.hero__body__inner',
    noResultsXPath: '//p[contains(text(), "The page you’re looking for can’t be found")]',
    zipcode: '',
  },
};
