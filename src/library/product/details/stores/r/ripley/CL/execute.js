
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CL',
    store: 'ripley',
    domain: 'ripley.cl',
    loadedSelector: "div[class='product-carousel-container gallery-container'] div[class='owl-wrapper-outer'] div[class='owl-item'] img",
    noResultsXPath: "//div[@class='error-page-container']//div[@class='error-page']",
    zipcode: '',
  },
};
