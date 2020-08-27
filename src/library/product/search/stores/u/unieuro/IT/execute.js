
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IT',
    store: 'unieuro',
    domain: 'unieuro.it',
    url: 'https://www.unieuro.it/online/?q={searchTerms}',
    loadedSelector: '[class="item-container"] img.product-img',
    noResultsXPath: '//div[@id="no-results-message"]',
    zipcode: '',
  },
};
