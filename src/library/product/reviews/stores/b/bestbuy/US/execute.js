
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'US',
    store: 'bestbuy',
    domain: 'bestbuy.com',
    loadedSelector: null, // 'div.pl-page-content',
    noResultsXPath: null, // '//h3[@class="no-results-message"]',
    // reviewUrl: 'https://www.bestbuy.com/site/reviews/product/{id}?sort=MOST_RECENT',
    reviewUrl: 'https://www.bestbuy.com/site/searchpage.jsp?st={id}',
    sortButtonSelectors: null,
    zipcode: '',
  },
};
