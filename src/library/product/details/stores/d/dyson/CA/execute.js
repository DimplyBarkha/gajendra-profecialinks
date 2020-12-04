
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'dyson',
    domain: 'dysoncanada.ca',
    loadedSelector: 'main.product',
    noResultsXPath: `//h3[contains(text(), "page you're looking for can't be found.")]`,
    zipcode: '',
  },
};
