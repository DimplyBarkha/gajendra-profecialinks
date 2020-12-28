
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    domain: 'bestbuy.com',
    loadedSelector: null, // 'div.pl-page-content',
    noResultsXPath: '//h3[@class="no-results-message"]',
    reviewUrl: 'https://www.bestbuy.com/site/{id}.p?skuId={id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
