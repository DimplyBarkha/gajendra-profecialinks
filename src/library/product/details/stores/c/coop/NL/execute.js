
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'coop',
    domain: 'coop.nl',
    loadedSelector: 'div.primeDetails',
    noResultsXPath: "//h1[contains(text(),'We kunnen de pagina die je zoekt niet vinden of het product dat je')]",
    zipcode: '',
  },
};
