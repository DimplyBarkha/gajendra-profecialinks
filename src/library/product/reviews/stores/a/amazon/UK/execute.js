
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    domain: 'amazon.co.uk',
    loadedSelector: '[data-hook="review"]',
    noResultsXPath: '//span[contains(text(),"No customer reviews")]',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
