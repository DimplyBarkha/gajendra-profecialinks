
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'microspot',
    domain: 'microspot.ch/fr',
    url: 'https://www.microspot.ch/fr/search?search={searchTerms}',
    loadedSelector: 'div._2BnkaG.dPm_Og',
    noResultsXPath: '//*[contains(text(),"Votre recherche de Machine")]',
    zipcode: ''
  },
};
