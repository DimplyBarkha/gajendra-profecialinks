
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'microspot',
    domain: 'microspot.ch/fr',
    url: 'https://www.microspot.ch/fr/search?search={searchTerms}',
    loadedSelector: '#container-productlist > div:last-child img',
    noResultsXPath: '//*[contains(text(),"Tipps für Ihre Suche:")]',
    zipcode: '',
  },
};
