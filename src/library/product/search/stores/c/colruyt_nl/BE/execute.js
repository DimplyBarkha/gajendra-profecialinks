
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'colruyt_nl',
    domain: 'colruyt.be',
    url: 'https://colruyt.collectandgo.be/cogo/nl/zoeken?z={searchTerms}',
    loadedSelector: 'div#articles',
    noResultsXPath: '//div[contains(@class,"no-result-page")]',
    zipcode: '',
  },
};
