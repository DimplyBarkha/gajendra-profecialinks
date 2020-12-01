
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'but',
    domain: 'but.fr',
    loadedSelector: '#main-product-sheet img',
    noResultsXPath: '//div[@id="bloc_central_interieur"]',
    zipcode: '',
  },
};
