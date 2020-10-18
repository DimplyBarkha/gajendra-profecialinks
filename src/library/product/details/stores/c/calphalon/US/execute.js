
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'calphalon',
    domain: 'calphalon.com',
    loadedSelector: 'div.namePartPriceContainer',
    noResultsXPath: "//h2[contains(text(),'SORRY! THE PAGE YOU WERE LOOKING FOR')]",
    zipcode: '',
  },
};
