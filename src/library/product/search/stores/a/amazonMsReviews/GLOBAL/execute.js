
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GLOBAL',
    store: 'amazonMsReviews',
    domain: 'amazon.com',
    url: 'https://www.amazon.com/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook=review]',
    zipcode: '',
  },
};
