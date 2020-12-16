
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'colruyt',
    domain: 'colruyt.be',
    url: 'https://colruyt.collectandgo.be/cogo/fr/chercher?z={searchTerms}',
    loadedSelector: 'div#articles',
    noResultsXPath: '//div[contains(@class,"no-result-page")]',
    zipcode: '',
  },
};
