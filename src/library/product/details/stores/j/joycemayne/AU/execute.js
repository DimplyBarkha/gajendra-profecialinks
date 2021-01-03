
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'joycemayne',
    domain: 'joycemayne.com.au',
    loadedSelector: '#category-grid [class="product-item"],#product-view-price',
    noResultsXPath: '//h1[contains(.,"0 items found")]',
    zipcode: '',
  },
};
