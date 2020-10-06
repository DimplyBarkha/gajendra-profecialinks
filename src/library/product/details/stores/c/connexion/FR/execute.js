
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'connexion',
    domain: 'connexion.fr',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"wrapper_error")]',
    zipcode: '',
  },
};
