
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'dyson',
    domain: 'dyson.in',
    loadedSelector: 'div[class*="hero--product-variant"] div.hero__body',
    noResultsXPath: '//h2[contains(text(),"no results")]',
    zipcode: '',
  },
};
