
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'grofers',
    domain: 'grofers.com',
    loadedSelector: 'div.pdp-product__container',
    noResultsXPath: "//div[@class='store-card-categories']",
    zipcode: '',
  },
};
