
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'FR',
    store: 'cigaretteelec',
    domain: 'cigaretteelec.fr',
    loadedSelector: 'div#product-top',
    noResultsXPath: '//div[@id=notfound-text] | //div[contains(text(),"Ce produit n\'a pas encore d\'avis")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
