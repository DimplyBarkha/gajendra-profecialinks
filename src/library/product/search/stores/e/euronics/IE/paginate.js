
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IE',
    store: 'target',
    openSearchDefinition: {
      indexOffset: 0,
    },
    loadedSelector: 'div[data-test="product-grid"] div',
    domain: 'euronics.ie',
  },
};
