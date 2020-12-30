
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CA',
    store: 'bestbuyCA',
    domain: 'bestbuy.ca',
    url: 'https://bestbuy.ca/en-ca/search?search={searchTerms}',
    //url: 'https://www.bestbuy.ca/en-ca/brand/{searchTerms}',
    loadedSelector: 'div[class="productList_31W-E"]',
    noResultsXPath: '//body[@id="page-not-found"]',
  },
};
