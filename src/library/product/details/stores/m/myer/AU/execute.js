
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    domain: 'myer.com.au',
    loadedSelector: "div ol li img[data-automation='product-image']",
    noResultsXPath: "//h1[@data-automation='product-not-found-heading'] | //div[@data-automation='out-of-stock-notification-wrapper']//h3[text()='It looks like that item is out of stock']",
    zipcode: '',
  },
};
