
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'birite',
    domain: 'birite.com.au',
    loadedSelector: 'body',
    noResultsXPath: "//div[contains(@class,'woocommerce')]//p[contains(@class,'woocommerce-info')]",
    zipcode: '',
  },
};
