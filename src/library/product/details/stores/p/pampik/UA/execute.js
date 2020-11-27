
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UA',
    store: 'pampik',
    domain: 'pampik.com',
    loadedSelector: "div[id='slider-big'] div[class='slick-slide slick-current slick-active'] img[itemprop='image']",
    noResultsXPath: "//div[@class='error-img']",
    zipcode: '',
  },
};
