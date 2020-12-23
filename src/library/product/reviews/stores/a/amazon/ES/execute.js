module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'ES',
    store: 'amazon',
    domain: 'amazon.es',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: '//div[contains(@id,"review_list")  and not( //div[contains(@id,"customer_review")]) ]',
    reviewUrl: 'https://www.amazon.es/product-reviews/{id}/?sortBy=recent',
  },
};
