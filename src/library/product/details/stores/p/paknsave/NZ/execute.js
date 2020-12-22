
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'paknsave',
    domain: 'paknsave.co.nz',
    loadedSelector: 'div.sxa-recipe-body__content',
    noResultsXPath: "//h3[contains(text(),'The page you’re looking for can’t be found')]",
    zipcode: '',
  },
};
