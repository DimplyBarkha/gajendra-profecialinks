
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'kalamazoo',
    domain: 'kalamazoo.es',
    loadedSelector: '#skuZoomImage img',
    noResultsXPath: '//div[@id="notFoundContent"]//p[contains(@class,"GenericErrorPageH1Text")]',
    zipcode: '',
  },
};
