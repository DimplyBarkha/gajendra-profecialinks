
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CH',
    store: 'microspot',
    domain: 'microspot.ch',
    url: 'https://www.microspot.ch/de/search?search={searchTerms}',
    loadedSelector: '#container-productlist',
    noResultsXPath: '//*[contains(text(),"Tipps für Ihre Suche:")]',
    zipcode: '',
  },
};
