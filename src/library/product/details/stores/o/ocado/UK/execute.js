
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'ocado',
    domain: 'ocado.com',
    loadedSelector: '#overview',
    noResultsXPath: '//div[contains(@class,"nf-resourceNotFound")]',
  },
};
