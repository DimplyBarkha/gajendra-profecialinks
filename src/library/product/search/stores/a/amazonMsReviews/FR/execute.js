
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'amazonMsReviews',
    domain: 'amazon.fr',
    url: 'https://www.amazon.fr/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook=review]',
    noResultsXPath: '//div[contains(@class, "no-reviews-section")]',
    zipcode: '',
  },
};
