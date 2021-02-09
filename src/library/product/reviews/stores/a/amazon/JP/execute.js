
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'JP',
    store: 'amazon',
    domain: 'amazon.co.jp',
    loadedSelector: 'div#cm_cr-review_list',
    noResultsXPath: '//td/b[contains(text(),"Looking for something?")]',
    reviewUrl: 'https://www.amazon.co.jp/-/en/product-reviews/{id}?sortBy=recent&pageNumber=1',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
