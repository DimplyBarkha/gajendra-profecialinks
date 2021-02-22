
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'JP',
    store: 'qoo10',
    domain: 'qoo10.jp',
    loadedSelector: 'div.review_summary ul#reviews_wrapper',
    noResultsXPath: '//div[@class="review_summary"]//ul[@id="reviews_wrapper" and string-length(*)=0]',
    reviewUrl: 'https://www.qoo10.jp/item/productname/{id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
