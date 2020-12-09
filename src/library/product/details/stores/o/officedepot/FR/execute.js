module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'officedepot',
    domain: 'officedepot.fr',
    loadedSelector: 'div#skuImage',
    noResultsXPath: "//h2[contains(text(), 'Nous sommes désolés mais la page')]",
    zipcode: '',
  },
};
