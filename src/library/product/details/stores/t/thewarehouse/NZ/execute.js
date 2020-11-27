
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'thewarehouse',
    domain: 'thewarehouse.co.nz',
    loadedSelector: 'div#product-content',
    noResultsXPath: "//h1[text()='Page not found']",
    zipcode: '',
  },
};
