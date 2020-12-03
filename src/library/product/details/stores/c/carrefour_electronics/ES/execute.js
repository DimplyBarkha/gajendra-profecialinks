
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'carrefour_electronics',
    domain: 'carrefour.es',
    loadedSelector: 'div.product-header',
    noResultsXPath: '//div[contains(@class, "home-view__main")] | //div[contains(@class, "plp-view__list")]',
    zipcode: '',
  },
};
