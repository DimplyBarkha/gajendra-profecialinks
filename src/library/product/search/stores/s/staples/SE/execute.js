
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'staples',
    domain: 'staples.se',
    url: 'https://www.staples.se/search?keywords={searchTerms}',
    loadedSelector: 'main>div#PageInner',
    noResultsXPath: '//div[@id="divSearch"]/div[contains(@class,"dvNoResults")]/h1',
    zipcode: '',
  },
};
