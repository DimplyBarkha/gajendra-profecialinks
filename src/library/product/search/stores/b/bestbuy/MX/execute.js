
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'bestbuy',
    domain: 'bestbuy.com.mx',
    url: 'https://www.bestbuy.com.mx/c/buscar-best-buy/buscar?query={searchTerms}',
    loadedSelector: 'div[class="product-line-item-line"]',
    noResultsXPath: '//p[@class="plp-no-results"]',
    zipcode: '',
  },
};
