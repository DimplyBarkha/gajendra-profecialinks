
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'superdrug',
    domain: 'superdrug.com',
    loadedSelector: 'div#pdp__details',
    noResultsXPath: '//div[@id="no_results"]|//h1[contains(text(), "sorry, this product is no longer available")]',
    zipcode: '',
  },
};
