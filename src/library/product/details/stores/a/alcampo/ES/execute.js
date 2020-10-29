
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'alcampo',
    domain: 'alcampo.es',
    loadedSelector: 'div.productDetailsPanel',
    noResultsXPath: '//div[@class="page-not-found-content"]',
    zipcode: '',
  },
};
