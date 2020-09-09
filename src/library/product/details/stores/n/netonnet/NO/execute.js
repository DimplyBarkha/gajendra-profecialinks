
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NO',
    store: 'netonnet',
    domain: 'netonnet.no',
    loadedSelector: 'body',
    noResultsXPath: '//div[contains(@class,"alert-warning search-warning")]',
    zipcode: '',
  },
};
