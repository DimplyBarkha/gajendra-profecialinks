
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SA',
    store: 'danube',
    domain: 'danube.sa',
    url: 'https://www.danube.sa/en/search?query={searchTerms}',
    loadedSelector: 'div.ais-hits--item',
    noResultsXPath: '//div[contains(@class,"ais-hits__empty")]',
    zipcode: '',
  },
};
