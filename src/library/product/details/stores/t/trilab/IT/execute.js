
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'trilab',
    domain: 'trilab.it',
    loadedSelector: 'div.product-info-main',
    noResultsXPath: "//div[@class='no-route-content']",
    zipcode: '',
  },
};
