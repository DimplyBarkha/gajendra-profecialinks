
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'samsclub',
    domain: 'samsclub.com',
    loadedSelector: '.reviews-questions',
    noResultsXPath: '//div[@class="main-wrapper"]//div[@role="region"]',
    reviewUrl: 'https://www.samsclub.com/p/{id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
