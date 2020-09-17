module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'thegoodguys',
    domain: 'thegoodguys.com.au',
    loadedSelector: '#delivery_store_stock_opt',
    noResultsXPath: '//*[contains(@class,"results_description")]',
    zipcode: '',
  },
};
