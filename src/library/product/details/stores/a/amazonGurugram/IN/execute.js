
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'amazonGurugram',
    domain: 'amazon.in',
    loadedSelector: null,
    noResultsXPath: null,
   // noResultsXPath: '//b[contains(text(),"Looking for something?")]/ancestor::table',
    zipcode: '',
  },
};
