
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'group-digital',
    domain: 'group-digital.fr',
    loadedSelector: null,
    noResultsXPath: '//h1[contains(text(),"La page demandée est introuvable")]',
    zipcode: '',
  },
};
