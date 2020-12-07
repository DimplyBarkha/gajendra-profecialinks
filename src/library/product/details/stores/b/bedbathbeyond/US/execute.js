
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'bedbathbeyond',
    domain: 'bedbathbeyond.com',
    loadedSelector: 'img[class*="ProductMediaCarouselStyle"]',
    noResultsXPath: '//div[@id="app" and not(//img[contains(@class, "ProductMediaCarouselStyle")])] | //span[contains(@id, "ctl00_InvalidRequest")]',
    zipcode: '',
  },
};
