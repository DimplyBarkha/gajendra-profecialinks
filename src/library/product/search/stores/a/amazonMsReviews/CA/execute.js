
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'amazonMsReviews',
    domain: 'amazon.ca',
    url: 'https://www.amazon.ca/product-reviews/{searchTerms}/?sortBy=recent',
    loadedSelector: 'div[data-hook=review]',
    noResultsXPath: null,
    zipcode: '',
  },
};
