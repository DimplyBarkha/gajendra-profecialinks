
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'MX',
    store: 'bestbuy',
    domain: 'bestbuy.com.mx',
    url: 'https://www.bestbuy.com.mx/c/buscar-best-buy/buscar?query={searchTerms}',
    loadedSelector: "div[class='row']  div[class='product-line-item-line'] div[class='sku-model']",
    noResultsXPath: "div[class='corrected-query']",
    zipcode: '',
  },
};
