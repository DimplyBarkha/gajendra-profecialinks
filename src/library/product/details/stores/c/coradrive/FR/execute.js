
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'coradrive',
    domain: 'coradrive.fr',
    loadedSelector: null,
    noResultsXPath: '//h2[contains(text(),"Aucun résultat n’a été trouvé")] | //p[contains(text()," Erreur 404")] | //p[contains(text(),"Site en maintenance")]',
    zipcode: '',
  },
};
