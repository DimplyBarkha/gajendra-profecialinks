
module.exports = {
  implements: 'tracker/categories/execute',
  parameterValues: {
    country: 'FR',
    store: 'vikingdirect',
    domain: 'vikingdirect.fr',
    loadedSelector: 'div#menuWrapper',
    noResultsXPath: '//h1[contains(.,"Référence invalide")]',
    zipcode: '',
  },
};
