
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'coop',
    domain: 'coop.co.uk',
    loadedSelector: 'div.coop-c-product__content',
    noResultsXPath: "//h2[contains(text(),'Page not found')]",
    zipcode: '',
  },
};
