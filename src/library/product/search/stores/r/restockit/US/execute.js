
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'restockit',
    domain: 'restockit.com',
    url: 'https://www.restockit.com/search.aspx?keyword={searchTerms}',
    loadedSelector: '#hawkitemlist',
    noResultsXPath: '//div[contains(@class, "zero-results")]//h1[@id="pageHeading"][contains(text(), "0 Products")]',
    zipcode: '',
  },
};
