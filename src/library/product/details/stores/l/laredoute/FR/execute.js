
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'laredoute',
    domain: 'laredoute.fr',
    loadedSelector: "h2.pdp-title",
    noResultsXPath: "//div[contains(@class, 'error_pages')] | //ul[@id='productList']",
    zipcode: '',
  },
};
