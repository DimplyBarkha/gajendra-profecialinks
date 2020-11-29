
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    domain: 'beru.ru',
    loadedSelector: 'div[data-zone-name="productReviews"], div[data-apiary-widget-name="@marketplace/SkuSummary"]',
    noResultsXPath: '//h2[@data-auto="review-summary"][contains(.,"Отзывов о товаре Диспенсер")]',
    reviewUrl: 'https://beru.ru/product/{id}/reviews',
    sortButtonSelectors: '[data-tid-prop="885e359d"]|[value="dateDesc"][name="sorts"]|[data-tid-prop="98e96273"]',
    zipcode: '',
  },
};
