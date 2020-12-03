
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'vikingdirect',
    domain: 'vikingdirect.fr',
    loadedSelector: 'body',
    noResultsXPath: '//h1[contains(.,"Référence invalide")]',
    zipcode: '',
  },
};
