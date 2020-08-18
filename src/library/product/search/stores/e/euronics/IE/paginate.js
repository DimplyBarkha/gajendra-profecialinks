
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'target',
    loadedSelector: 'div[data-test="product-grid"] div',
    domain: 'euronics.ie',
  },
};
