
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'ah',
    domain: 'ah.nl',
    loadedSelector: 'img[data-testhook="product-image"]',
    noResultsXPath: '//div[contains(@class,"not-found_root")]',
    zipcode: '',
  },
};
