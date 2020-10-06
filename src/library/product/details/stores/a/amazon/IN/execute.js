
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'amazon',
    domain: 'amazon.in',
    loadedSelector: null,
    noResultsXPath: '//b[contains(text(),"Looking for something?")]/ancestor::table',
    zipcode: '',
  },
};
