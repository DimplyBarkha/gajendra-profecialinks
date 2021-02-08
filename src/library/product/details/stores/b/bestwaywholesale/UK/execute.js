
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'bestwaywholesale',
    domain: 'bestwaywholesale.co.uk',
    zipcode: '',
    noResultsXPath: '//div[contains(@class,"curved-shadow") or contains(@class,"no-search-results")]',
  },
};
