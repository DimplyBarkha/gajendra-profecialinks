
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'MX',
    store: 'bestbuy',
    domain: 'bestbuy.com.mx',
    loadedSelector: "div[class='third-party-product-info']",
    noResultsXPath: "//div[@class='container error-message']",
    zipcode: '',
  },
};
