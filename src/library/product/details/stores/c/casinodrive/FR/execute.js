
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'casinodrive',
    domain: 'casinodrive.fr',
    loadedSelector: 'div[class="cnt-large cnt"] img',
    noResultsXPath: '//h2[text()="Une erreur est survenue"]',
    zipcode: '',
  },
};
