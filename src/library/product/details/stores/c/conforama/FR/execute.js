
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'but',
    domain: 'but.fr',
    loadedSelector: 'div[id="product-main"]',
    noResultsXPath: '//div[@id="bloc_central_interieur"]',
    zipcode: '',
  },
};
