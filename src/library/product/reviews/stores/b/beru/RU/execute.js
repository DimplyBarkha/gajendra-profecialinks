
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    domain: 'beru.ru',
    loadedSelector: 'div[data-zone-name="productReviews"], div[data-apiary-widget-name="@marketplace/SkuSummary"]',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelector: null,
    zipcode: '',
  },
};
