
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'hair-gallery',
    domain: 'hair-gallery.it',
    loadedSelector: 'div.product-info-item',
    noResultsXPath: "//h2[contains(text(),'La pagina non è stata trovata')]",
    zipcode: '',
  },
};
