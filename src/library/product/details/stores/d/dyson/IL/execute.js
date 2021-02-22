
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IL',
    store: 'dyson',
    domain: 'dyson.co.il',
    loadedSelector: 'div[class*="hero--product-variant"] div.hero__body',
    noResultsXPath: '//p[contains(text(), "can’t be found")]',
    zipcode: '',
  },
};
