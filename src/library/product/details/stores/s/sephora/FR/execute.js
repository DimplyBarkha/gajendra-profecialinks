
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'sephora',
    domain: 'sephora.fr',
    loadedSelector: 'div.product-top-content',
    noResultsXPath: 'div.no-hits-content',
    zipcode: '',
  },
};
