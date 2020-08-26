module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'procie',
    domain: 'procie.com',
    loadedSelector: "div[id='mainImgProduct'] img",
    noResultsXPath: '//p[contains(text(),"Aucun résultat ne correspond à votre recherche")]',
    zipcode: '',
  },
};
