module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'procie',
    domain: 'procie.com',
    loadedSelector: "div[id='mainImgProduct'] img",
    noResultsXPath: `//div[contains(@class,"ficheProduit")]//p[contains(text(),"Aucune donnée n'a été trouvée pour ce produit")]`,
    zipcode: '',
  },
};
