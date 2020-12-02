
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'CA',
    store: 'bedbathbeyond',
    domain: 'bedbathbeyond.ca',
    loadedSelector: 'img[class*="ProductMediaCarouselStyle"]',
    noResultsXPath: '//div[@id="app" and not(//img[contains(@class, "ProductMediaCarouselStyle")])]',
    zipcode: '',
  },
};
