
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'eprice',
    domain: 'eprice.it',
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class, 'sezNegozi')]",
    zipcode: '',
  },
};
