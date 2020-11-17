
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'carrefour',
    domain: 'carrefour.eu',
    loadedSelector: 'div.product-details',
    noResultsXPath: "//div[@class='search-empty']",
    zipcode: '',
  },
};
