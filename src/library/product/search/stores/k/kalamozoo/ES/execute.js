
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'kalamozoo',
    domain: 'kalamozoo.es',
    url: 'https://www.kalamazoo.es/search?x=0&y=0&keywords={searchTerms}',
    loadedSelector: 'div[id="ResultsSection"]',
    noResultsXPath: '//div[contains(@class,"NoSearchResults")]',
    zipcode: '',
  },
};
