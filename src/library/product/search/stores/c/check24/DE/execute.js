
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'check24',
    domain: 'check24.de',
    url: 'https://shopping.check24.de/suche.html?query={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@class="fakeresult_headline"]',
    zipcode: '',
  },
};