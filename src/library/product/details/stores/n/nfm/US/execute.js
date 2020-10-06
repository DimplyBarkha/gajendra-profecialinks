
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'nfm',
    domain: 'nfm.com',
    loadedSelector: null,
    noResultsXPath: "//p[contains(text(), 'No Results Found')]",
    zipcode: '',
  },
};
