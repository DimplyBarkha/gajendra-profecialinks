
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'bigw',
    domain: 'bigw.com.au',
    loadedSelector: 'div.product-listing',
    noResultsXPath: '//div[@class="error-page__content"]',
    url: 'https://www.bigw.com.au/search?q={searchTerms}',
    zipcode: '',
  },
};
