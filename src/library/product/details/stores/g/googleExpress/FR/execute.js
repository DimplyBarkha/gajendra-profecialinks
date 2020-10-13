
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'googleExpress',
    domain: 'google.com',
    loadedSelector: "div[class*='sh-div__link-to-overlay'] div[class*='div__viewport'] div[class*='main-image'] img",
    noResultsXPath: "//div[contains(@class,'product-not-found')]",
    zipcode: '',
  },
};
