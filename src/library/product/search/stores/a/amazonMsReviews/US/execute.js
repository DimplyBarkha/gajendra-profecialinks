
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazonMsReviews',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook=review]',
<<<<<<< HEAD
    noResultsXPath: '//div[contains(@class, "no-reviews-section")]', 
=======
    noResultsXPath: '//div[contains(@class, "no-reviews-section")]',
>>>>>>> MS-reviews-amazon_us
  },
};
