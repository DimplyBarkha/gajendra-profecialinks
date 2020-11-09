
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'ah',
    domain: 'ah.be',
    loadedSelector: null,
    noResultsXPath: "//div[contains(@class, 'not-found_root')]",
    zipcode: '',
  },
};
