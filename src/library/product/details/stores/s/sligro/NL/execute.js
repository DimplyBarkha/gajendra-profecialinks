
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'sligro',
    domain: 'sligro.nl',
    loadedSelector: 'div.cmp-productdetail__container',
    noResultsXPath: "//li[contains(text(),'404 Page not found')]",
    zipcode: '',
  },
};
