
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    domain: 'beru.ru',
    loadedSelector: 'div[data-zone-name="productReviews"], div[data-apiary-widget-name="@marketplace/SkuSummary"]',
    noResultsXPath: '//h2[@data-auto="review-summary"][contains(.,"Отзывов о товаре Диспенсер")]',
    reviewUrl: 'https://beru.ru/product/{id}/reviews',
    sortButtonSelector: null,
    zipcode: '',
  },
};
