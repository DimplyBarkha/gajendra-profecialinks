
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SA',
    store: 'dyson',
    domain: 'dyson.sa',
    loadedSelector: 'div.hero__body',
    noResultsXPath: '//div[contains(@class,"layout")]/*[contains(text(), "returned no results")]',
    zipcode: '',
  },
};
