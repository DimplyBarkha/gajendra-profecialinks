
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'albertheijn',
    domain: 'ah.nl',
    loadedSelector: 'img[data-testhook="product-image"][src]',
    noResultsXPath: '//div[starts-with(@class,"not-found_root")]',
  },
};
