
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ZA',
    store: 'pnp',
    domain: 'pnp.co.za',
    loadedSelector: 'div[class*=product-card-item]',
    noResultsXPath: '//div[contains(@class,"notFoundPage")]',
    zipcode: '',
  },
};
