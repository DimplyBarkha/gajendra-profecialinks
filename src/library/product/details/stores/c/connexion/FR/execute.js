
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'connexion',
    domain: 'connexion.fr',
    loadedSelector: null,
    noResultsXPath: '//h3[contains(text(),"Oups !")]',
    zipcode: '',
  },
};
