
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'DE',
    store: 'blu',
    domain: 'blu.com',
    loadedSelector: 'div[data-testid="productDetailsBlock"]',
    noResultsXPath: 'boolean(//div[@class="sc-1tgc0g2-2 ipFJnx"])',
    reviewUrl: null,
    sortButtonSelectors: null,
    zipcode: '',
  },
};
