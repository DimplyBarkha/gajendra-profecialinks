
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'LU',
    store: 'hifi',
    domain: 'hifi.lu',
    loadedSelector: '.product-image-slider',
    noResultsXPath: '//section[contains(@class,"error-content")]/h1[contains(text(),"Oups")]',
    zipcode: '',
  },
};
