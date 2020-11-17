
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'carrefour',
    domain: 'carrefour.eu',
    loadedSelector: 'div#product-detail-container',
    noResultsXPath: "//div[@class='search-empty']",
    zipcode: '',
  },
};
