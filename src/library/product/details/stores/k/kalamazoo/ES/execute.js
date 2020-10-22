
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'kalamazoo',
    domain: 'kalamazoo.es',
    loadedSelector: 'ul[class*="sku-slider-wrapper"] img',
    noResultsXPath: '//h2[@class="error-pages__subtitle"]',
    zipcode: '',
  },
};
