
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NO',
    store: 'elkjop',
    domain: 'elkjop.no',
    loadedSelector: 'div#site-wrapper',
    noResultsXPath: "//div[@id='searchProductsInfo']",
    zipcode: '',
  },
};
