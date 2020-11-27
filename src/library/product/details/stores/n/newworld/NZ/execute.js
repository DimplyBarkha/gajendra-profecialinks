
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NZ',
    store: 'newworld',
    domain: 'newworld.co.nz',
    loadedSelector: 'div.sxa-recipe-body__body',
    noResultsXPath: "//h1[contains(text(),'The page you’re looking for can’t be found')]",
    zipcode: '',
  },
};
