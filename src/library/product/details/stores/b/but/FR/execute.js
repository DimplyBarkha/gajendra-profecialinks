
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'but',
    domain: 'but.fr',
    loadedSelector: '#product-main',
    noResultsXPath: '//div[@id="bloc_central_interieur"] | //div[@id="products-list-content"]',
    zipcode: '',
  },
};
