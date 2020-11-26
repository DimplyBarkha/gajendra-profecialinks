
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'douglas',
    domain: 'douglas.at',
    loadedSelector: '.media-gallery__main-image img',
    noResultsXPath: '//div[contains(@class,"error-404-component")]',
    zipcode: '',
  },
};
