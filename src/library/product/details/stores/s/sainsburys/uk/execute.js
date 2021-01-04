
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'Sainsburys',
    domain: 'sainsburys.co.uk',
    loadedSelector: 'h1[data-test-id="pd-product-title"]',
    noResultsXPath: null,
    zipcode: '',
  },
};
