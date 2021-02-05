
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'cdw',
    domain: 'cdw.com',
    url: 'https://www.cdw.com/search/?key={searchTerms}&pcurrent=1',
    loadedSelector: 'div.search-results',
    noResultsXPath: '//div[@class="no-results-error-message"]',
    zipcode: '',
  },
};
