
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'krefel',
    domain: 'krefel.be',
    loadedSelector: null,
    noResultsXPath: '//section[contains(@class,"error-content")]',
    zipcode: '',
  },
};
