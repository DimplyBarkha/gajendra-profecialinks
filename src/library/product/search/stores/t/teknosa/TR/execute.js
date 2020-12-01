module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    domain: 'teknosa.com',
    url: 'https://www.teknosa.com/arama/?s={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//strong[text()="Aradığınız kriterlere uygun sonuç bulamadık."]',
    zipcode: '',
  },
};
