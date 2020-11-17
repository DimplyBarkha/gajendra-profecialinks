
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'staples',
    domain: 'jpg.fr',
    url: 'https://www.jpg.fr/search?keywords={searchTerms}',
    loadedSelector: 'main>div#PageInner',
    noResultsXPath: '//div[@id="divSearch"]/div[contains(@class,"dvNoResults")]/h1',
    zipcode: '',
  },
};
