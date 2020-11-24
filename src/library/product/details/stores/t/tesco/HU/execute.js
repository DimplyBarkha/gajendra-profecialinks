
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'HU',
    store: 'tesco',
    domain: 'tesco.hu',
    loadedSelector: 'div.product-overview',
    noResultsXPath: "//h1[contains(text(),'Hoppá, valami hiba történt! (404)')]",
    zipcode: '',
  },
};
