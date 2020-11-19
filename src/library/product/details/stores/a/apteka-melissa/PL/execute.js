
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'PL',
    store: 'apteka-melissa',
    domain: 'apteka-melissa.pl',
    loadedSelector: '.lSSlideOuter li[class*="active"] img, .product-photo',
    noResultsXPath: '//h2[contains(.,"404")]',
    zipcode: '',
  },
};
