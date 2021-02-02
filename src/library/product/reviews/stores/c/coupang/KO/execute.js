
module.exports = {
  implements: 'product/reviews/execute',
  parameterValues: {
    country: 'KO',
    store: 'coupang',
    domain: 'coupang.com',
    loadedSelector: 'section#contents',
    noResultsXPath: '//h3[contains(@class,"error-img")]',
    reviewUrl: 'https://www.coupang.com/vp/products/{id}?isAddedCart=',
    sortButtonSelectors: null,
    zipcode: '',
  },
};