module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'homedepot',
    domain: 'homedepot.com',
    loadedSelector: null,
    noResultsXPath: '//p[text()="The product you are trying to view is not currently available"]|//*[@data-testid="errorContent"]',
    zipcode: '',
  },
};
