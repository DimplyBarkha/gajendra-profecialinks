
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AR',
    store: 'fravega',
    domain: 'fravega.com',
    url: 'https://www.fravega.com/l/?keyword={searchTerms}',
    loadedSelector: null,
    noResultsXPath: '//div[@data-test-id="noItemsResult"]',
    zipcode: '',
  },
};
