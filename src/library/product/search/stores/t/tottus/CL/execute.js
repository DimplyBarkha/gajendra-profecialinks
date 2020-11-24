
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'CL',
    store: 'tottus',
    domain: 'tottus.cl',
    url: 'https://www.tottus.cl/buscar?q={searchTerms}',
    loadedSelector: 'div.productList li.product',
    noResultsXPath: '//div[@class="error-image"]',
    zipcode: "''",
  },
};
