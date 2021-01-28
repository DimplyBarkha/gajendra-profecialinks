
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'farmaciasguadalajara',
    domain: 'farmaciasguadalajara.com',
    loadedSelector: 'img#productMainImage',
    noResultsXPath: '//h3[contains(text(),"Página no encontrada")]',
    zipcode: '',
  },
};
