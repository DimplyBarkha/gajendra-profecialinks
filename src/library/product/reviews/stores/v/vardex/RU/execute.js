
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'RU',
    store: 'vardex',
    domain: 'vardex.ru',
    loadedSelector: 'div#customer-reviews',
    noResultsXPath: '//span[contains(@class,"b_product_detail__rating__review__count")][string-length(text()) <= 0]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
