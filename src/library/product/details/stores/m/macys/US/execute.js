
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'macys',
    domain: 'macys.com',
    loadedSelector: null,
    noResultsXPath: '//h1[contains(text(),"Access Denied")]',
    zipcode: '',
  },
};
