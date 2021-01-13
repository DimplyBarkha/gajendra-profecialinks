
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'newegg',
    domain: 'newegg.com',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class,"page-404-text")]',
    zipcode: "''",
  },
};
