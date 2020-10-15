
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'hulpmiddelwereld',
    domain: 'hulpmiddelwereld.nl',
    loadedSelector: 'div.product-essential',
    noResultsXPath: "//h2[contains(text(),'Sorry, we kunnen deze pagina niet meer vinden')]",
    zipcode: '',
  },
};
