
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'saksfifthavenue',
    domain: 'saksfifthavenue.com',
    url: 'https://www.saksfifthavenue.com/{queryParams}',
    loadedSelector: 'div.search-result-wrapper div.product-grid',
    noResultsXPath: null,
    zipcode: '',
  },
};
