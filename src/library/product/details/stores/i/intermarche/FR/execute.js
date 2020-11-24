module.exports = {
  implements: "product/details/execute",
  parameterValues: {
    country: "FR",
    store: "Intermarche",
    domain: "intermarche.com",
    loadedSelector: '[class^="product-price--unit ProductPrice__PriceUnit"]',
    noResultsXPath: '//*[@id="go_home"]',
    zipcode: "",
  },
};
