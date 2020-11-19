
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'mecca',
    domain: 'mecca.com.au',
    loadedSelector: 'div#core-product-information',
    noResultsXPath: "//span[contains(text(),'Page not found')]",
    zipcode: '',
  },
};
