
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AR',
    store: 'fravega',
    domain: 'fravega.com',
    loadedSelector: null,
    noResultsXPath: '//*[contains(text(), "No hay resultados")]',
    zipcode: '',
  },
};
