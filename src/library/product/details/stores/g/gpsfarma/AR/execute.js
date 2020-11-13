
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AR',
    store: 'gpsfarma',
    domain: 'gpsfarma.com',
    loadedSelector: "div[class='product-img-box'] div[class='product-image-gallery'] img[id='image-main']",
    noResultsXPath: "//div[@class='_error_page_gpsfarma']",
    zipcode: '',
  },
};
