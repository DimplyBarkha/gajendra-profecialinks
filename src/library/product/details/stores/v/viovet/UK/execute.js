
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'viovet',
    domain: 'viovet.co.uk',
    loadedSelector: null,
    noResultsXPath: '//h1[contains(text(), "did not match any products")] | //span[contains(text(), "Select a product")]',
    zipcode: '',
  },
};
