
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'ES',
    store: 'amazonMsReviews',
    domain: 'amazon.es',
    url: 'https://www.amazon.es/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook=review]',
    noResultsXPath: '//div[contains(@class, "no-reviews-section")]',
    zipcode: '',
  },
};
