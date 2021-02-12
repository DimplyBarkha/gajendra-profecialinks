
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'mytime',
    domain: 'mytime.de',
    loadedSelector: 'div.product-page__rating span.starbar__counter',
    noResultsXPath: '//div[@class="product-page__rating"]//div/span[1][not(contains(@class, "active"))] | //picture[@data-alt="Wechsler-Fehlserseite"]',
    reviewUrl: 'mytime.de/_{id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
