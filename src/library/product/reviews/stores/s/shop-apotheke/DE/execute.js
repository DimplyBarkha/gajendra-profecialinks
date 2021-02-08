
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'shop-apotheke',
    domain: 'shop-apotheke.com',
    loadedSelector: '.rating-list-wrapper',
    noResultsXPath: '//div[@class="text-center text-block"]/h1[contains(text(), 404)]',
    reviewUrl: 'https://www.shop-apotheke.com/produktbewertungen/{id}/.htm#user-reviews-section',
    sortButtonSelectors: '#ratingdatasort',
    zipcode: '',
  },
};
