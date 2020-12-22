
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'paknsave',
    domain: 'paknsave.co.nz',
    loadedSelector: 'section.fs-product-detail',
    noResultsXPath: "//h3[contains(text(),'The page you’re looking for can’t be found')]",
    zipcode: '',
  },
};
