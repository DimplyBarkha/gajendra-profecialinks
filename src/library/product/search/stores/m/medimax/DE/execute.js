
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'medimax',
    domain: 'medimax.de',
    url: 'https://www.medimax.de/search/?text={searchTerms}',
    loadedSelector: 'div[data-et-name]',
    noResultsXPath: '//h1[@class="search-no-hits-headline"]',
    zipcode: '',
  },
};
