
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ZA',
    store: 'picknpay',
    domain: 'pnp.co.za',
    loadedSelector: 'div.js-product-card-item',
    noResultsXPath: '//div[contains(@class, "notFoundPage")]',
    zipcode: '',
  },
};
