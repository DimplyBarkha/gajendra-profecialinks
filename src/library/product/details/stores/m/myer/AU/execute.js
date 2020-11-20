
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    domain: 'myer.com.au',
    loadedSelector: "img[data-automation='product-image']",
    noResultsXPath: "//h1[@data-automation='product-not-found-heading']",
    zipcode: '',
  },
};
