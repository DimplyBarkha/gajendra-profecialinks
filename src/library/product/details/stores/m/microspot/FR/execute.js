
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'microspot',
    domain: 'microspot.ch/fr',
    loadedSelector: 'div#TOP_CONTENT_ANCHOR',
    noResultsXPath: '//*[contains(text(),"Votre recherche de Machine")]',
    zipcode: '',
  },
};
