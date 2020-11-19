
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'argos',
    domain: 'argos.co.uk',
    loadedSelector: 'span[data-test="product-title"]',
    noResultsXPath: '//h1[@data-test="error-page-message-title"]',
    zipcode: 'SE19PD',
  },
};
