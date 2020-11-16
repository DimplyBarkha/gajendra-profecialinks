
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'jbhifi',
    domain: 'jbhifi.com.au',
    loadedSelector: 'div.product-overview',
    noResultsXPath: "//div[@class='content-404']//p[@class='content-404__subtitle']",
    zipcode: '',
  },
};
