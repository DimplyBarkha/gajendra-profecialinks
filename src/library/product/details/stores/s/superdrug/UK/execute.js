
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    domain: 'superdrug.com',
    loadedSelector: 'div#pdp__details',
    noResultsXPath: '//div[@id="no_results"]',
    zipcode: '',
  },
};
