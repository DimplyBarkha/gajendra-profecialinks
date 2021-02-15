
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BR',
    store: 'belezanaweb',
    domain: 'belezanaweb.com.br',
    loadedSelector: "div[class='nproduct-gallery'] div[class='owl-stage-outer'] div[class='owl-stage'] div[class='owl-item active'] img",//"div[class='product-brand-description']",
    noResultsXPath: "//article[contains(@class,'not-found-container')]",
    zipcode: '',
  },
};
