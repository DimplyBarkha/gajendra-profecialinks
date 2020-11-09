
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CL',
    store: 'paris',
    domain: 'paris.cl',
    loadedSelector: 'div.product-primary-image img.primary-image',
    noResultsXPath: '//p[@class="not-found-search"]',
    zipcode: '',
  },
};
