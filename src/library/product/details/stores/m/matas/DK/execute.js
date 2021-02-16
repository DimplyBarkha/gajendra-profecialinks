
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'matas',
    domain: 'matas.dk',
    loadedSelector: 'h1[class="product-name product-name--large"]',
    noResultsXPath: '//span[@class="color-positive-text"]',
    zipcode: '',
  },
};
