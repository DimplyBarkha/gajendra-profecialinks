
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'colesonline_macquariePark',
    domain: 'shop.coles.com.au',
    loadedSelector: 'div[class="main-content"], div[class="products"]',
    noResultsXPath: '//h1[@class="error-heading"], //span[@id="emptyCatalogEntryList"]',
    zipcode: '',
  },
};
