
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'delhaize',
    domain: 'delhaize.be',
    loadedSelector: null,
    noResultsXPath: '//div[contains(@class, "ErrorPage")]',
    zipcode: '',
  },
};
