
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'brownthomas',
    domain: 'brownthomas.com',
    url: 'https://www.brownthomas.com/search/?q={searchTerms}',
    loadedSelector: 'ul#product-search-result-items li:nth-last-child(1)',
    noResultsXPath: '//p[contains(@class,"no-hits-content-results")]',
    zipcode: '',
  },
};
