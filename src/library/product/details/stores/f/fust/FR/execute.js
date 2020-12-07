
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'fust',
    domain: 'fust.ch',
    loadedSelector: 'div.productDetail',
    noResultsXPath: "//h1[contains(text(),'Seite nicht gefunden')]",
    zipcode: '',
  },
};
