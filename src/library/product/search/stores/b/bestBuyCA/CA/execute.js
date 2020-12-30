
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'bestbuy',
    domain: 'bestbuy.ca',
    url: 'https://bestbuy.ca/en-ca/search?search={searchTerms}',
    loadedSelector: 'div[class="productList_31W-E"]',
    noResultsXPath: '//body[@id="page-not-found"]',
  },
};
