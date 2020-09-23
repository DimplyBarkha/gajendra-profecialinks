
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'dyson',
    domain: 'dyson.com.mx',
    loadedSelector: 'div[class*="hero--product-variant"] div.hero__body',
    noResultsXPath: '//p[contains(text(), "can’t be found")]',
    zipcode: '',
  },
};
