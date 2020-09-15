
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'bunnings',
    domain: 'bunnings.com.au',
    url: 'https://www.bunnings.com.au/search/products?page={page}&q={searchTerms}&sort=BoostOrder&pageSize={pageSize}',
    loadedSelector: 'product-list',
    noResultsXPath: '//div[contains(@class, "responsive-search-no-result")]',
    zipcode: '',
  },
};
