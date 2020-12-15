
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'macys',
    domain: 'macys.com',
    loadedSelector: 'body',
    noResultsXPath: '//p[@data-auto="error-text"]',
    zipcode: '',
  },
};
