
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'lidl',
    domain: 'lidl.de',
    loadedSelector: '.product-grid__section, .detailpage',
    noResultsXPath: null,
    zipcode: '',
  },
};
