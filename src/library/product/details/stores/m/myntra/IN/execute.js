
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'myntra',
    domain: 'myntra.com',
    loadedSelector: "div[class='image-grid-container common-clearfix'] div[class='image-grid-imageContainer'] div[class='image-grid-image']",
    noResultsXPath: "//span[text()='Sorry, this page is temporarily unavailable.']",
    zipcode: '',
  }
};
