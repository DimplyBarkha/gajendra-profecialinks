
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'microspot',
    domain: 'microspot.ch/fr',
    loadedSelector: 'div[class="_1Wdhtw"] or div[class="rzgLFq"]',
    noResultsXPath: '//*[contains(text(),"Votre recherche de Machine")] | //h2[contains(text(),"malheureusement plus disponible.")]',
    zipcode: '',
  },
};
