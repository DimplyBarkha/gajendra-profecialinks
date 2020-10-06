
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'laredoute',
    domain: 'laredoute.fr',
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class, 'error_pages')]",
    zipcode: '',
  },
};
