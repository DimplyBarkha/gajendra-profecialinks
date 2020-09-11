
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'monclick',
    domain: 'monclick.it',
    loadedSelector: 'section[class*="mk-content"]',
    noResultsXPath: '//span[contains(text(),"Prodotto non trovato")] | //span[contains(text(),"Spiacenti, il prodotto da te richiesto non è più pubblicato a catalogo.")]',
    zipcode: '',
  },
};
