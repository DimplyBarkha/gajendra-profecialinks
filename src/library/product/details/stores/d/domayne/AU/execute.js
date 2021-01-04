
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'domayne',
    domain: 'domayne.com.au',
    // loadedSelector: null,
    loadedSelector: 'div#category-grid, div.product-view-sales',
    noResultsXPath: '//h1[contains(.,"0 items found")]',
    zipcode: '',
  },
};
