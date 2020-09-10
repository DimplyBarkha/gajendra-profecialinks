
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'DE',
    store: 'saturn',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[data-test="mms-search-srp-productlist"]',
    noResultsXPath: '//div[contains(@class,"ZeroResultsView")] | /html[not(//meta[@property="og:url"][contains(@content,"search.html")])] | /html[not(//div[@data-test="mms-search-srp-productlist"]//div[@data-test="mms-search-srp-productlist-item"])]',
    openSearchDefinition: {
      template: 'https://www.saturn.de/de/search.html?query={searchTerms}&page={page}',
    },
    domain: 'saturn.de',
    zipcode: '',
  },
};
