
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ES',
    store: 'carrefour',
    domain: 'carrefour.es',
    loadedSelector: 'div[class="product-pics__container"] img,h1[class*="product-header__name"]',
    noResultsXPath: '//div[@id="error"] | //div[contains(@class,"text-banner-distributor")] | //div[contains(@class,"plp-food-view__list")] | //div[contains(@class,"error-view")] | //div[@id="delivery-code-box"]',
  },
};
