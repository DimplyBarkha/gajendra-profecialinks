
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'farmaciasdirect',
    domain: 'farmaciasdirect.com',
    loadedSelector: null,
    noResultsXPath: "//section[contains(@class,'page-not-found')]",
    zipcode: '28001',
  },
};
