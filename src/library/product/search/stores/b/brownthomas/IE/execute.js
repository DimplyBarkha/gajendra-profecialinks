
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'brownthomas',
    domain: 'brownthomas.com',
    url: 'https://www.brownthomas.com/search/?q={searchTerms}&lang=default',
    noResultsXPath: '//p[contains(@class,"no-hits-content-results")]',
    zipcode: '',
  },
};
