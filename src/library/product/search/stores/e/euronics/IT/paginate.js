
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IT',
    store: 'euronics',
    loadedSelector: 'div[data-test="product-grid"] div',
    domain: 'euronics.it',
  },
};
