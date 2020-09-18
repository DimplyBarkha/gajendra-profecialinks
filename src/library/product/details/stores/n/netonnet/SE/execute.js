
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'netonnet',
    domain: 'netonnet.se',
    loadedSelector: 'body',
    noResultsXPath: '//div[contains(@class,"alert-warning search-warning")]',
    zipcode: '',
  },
};
