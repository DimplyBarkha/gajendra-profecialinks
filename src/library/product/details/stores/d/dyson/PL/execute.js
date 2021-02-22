
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'dyson',
    domain: 'dyson.pl',
    loadedSelector: 'div.hero__body',
    noResultsXPath: '//div[contains(@class,"layout")]/*[contains(text(), "Nie można")]',
    zipcode: '',
  },
};
