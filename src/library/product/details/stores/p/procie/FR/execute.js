module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'procie',
    domain: 'procie.com',
    loadedSelector: '#wrap',
    noResultsXPath: '//p[contains(text(),"Aucun résultat ne correspond à votre recherche")]',
    zipcode: '',
  },
};
