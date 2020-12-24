
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'domayne',
    domain: 'domayne.com.au',
    // loadedSelector: null,
    loadedSelector: 'div#category-grid',
    noResultsXPath: null,
    zipcode: '',
  },
};
