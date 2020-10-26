
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'reservebar',
    domain: 'reservebar.com',
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class,'empty-page-content')]",
    zipcode: '',
  },
};
