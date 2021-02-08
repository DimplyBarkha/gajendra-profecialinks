
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'USA',
    store: 'bedbathbeyond',
    domain: 'bedbathbeyond.com',
    loadedSelector: 'img[class*="ProductMediaCarouselStyle"]',
    noResultsXPath: '//div[@id="app" and not(//img[contains(@class, "ProductMediaCarouselStyle")])]',
    zipcode: '',
  },
};
