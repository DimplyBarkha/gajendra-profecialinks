
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'RU',
    store: 'beru',
    domain: 'beru.ru',
    loadedSelector: 'div[data-zone-name="productReviews"]',
    noResultsXPath: null,
    reviewUrl: null,
    sortButtonSelector: null,
    zipcode: '',
  },
};
