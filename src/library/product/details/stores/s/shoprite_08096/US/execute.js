
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'shoprite_08096',
    domain: 'shoprite.com',
    // loadedSelector: 'div[class="cart_recommennded__productBox"]',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
