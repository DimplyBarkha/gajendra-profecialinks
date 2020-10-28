
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'houzz',
    domain: 'houzz.com',
    loadedSelector: "img[class*='view-product-image-print']",
    noResultsXPath: "//div[contains(@class,'hz-page-not-found')]",
    zipcode: '',
  },
};
