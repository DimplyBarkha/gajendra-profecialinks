
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'dyson',
    domain: 'dyson.ae',
    loadedSelector: 'div.hero__body',
    noResultsXPath: '//div[contains(@class,"layout")]/*[contains(text(), "can’t be found")]',
    zipcode: '',
  },
};
