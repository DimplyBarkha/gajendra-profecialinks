
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'DE',
    store: 'saturn',
    domain: 'saturn.de',
    url: 'https://www.saturn.de/de/search.html?query={searchTerms}',
    loadedSelector: 'div[data-test="mms-search-srp-productlist"]',
    noResultsXPath: '//div[contains(@class,"ZeroResultsView")] | /html[not(//meta[@property="og:url"][contains(@content,"search.html")])]',
  },
};
