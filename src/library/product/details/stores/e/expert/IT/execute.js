
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'expert',
    domain: 'expertonline.it',
    loadedSelector: 'div[itemprop="mainContentOfPage"]',
    noResultsXPath: '//h2[@class="SchedaNomeProdotto"] | //*[contains(text(), "Si è verificato un errore")] | //*[contains(text(), "An error has occurred")] | //*[contains(text(), "Ha ocurrido un error")] | //*[contains(text(), "Il y a eu une erreur")] | //*[contains(text(), "Spiacenti ma la tua ricerca non ha dato risultati.")]',
    zipcode: '',
  },
};
