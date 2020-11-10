
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'coursesu',
    domain: 'coursesu.com',
    loadedSelector: 'a.product-image.main-image img',
    noResultsXPath: '//h2/@data-su-analytics-search-error',
    zipcode: '76120',
  },
};
