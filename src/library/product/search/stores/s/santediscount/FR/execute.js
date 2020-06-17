
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'FR',
    store: 'santediscount',
    domain: 'santediscount.com',
    url: 'https://www.santediscount.com/catalogsearch/result/?q={searchTerms}',
    loadedSelector: 'section[class*="products-grid"] > article:nth-child(1)',
    noResultsXPath: '//div[contains(@class, "no_result--content")]',
  },
};
