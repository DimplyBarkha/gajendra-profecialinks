
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'HU',
    store: 'edigital',
    domain: 'edigital.hu',
    loadedSelector: "//div[@class='carousel-inner']//div[@class='item active']//a[@class='main-image-link']//img[@itemprop='contentUrl']/@src",
    noResultsXPath: "//section[@class='error-page']",
    zipcode: '',
  },
};
