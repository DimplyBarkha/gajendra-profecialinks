
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: '',
    store: 'stockmann',
    domain: 'stockmann.com',
    loadedSelector: 'body',
    noResultsXPath: '//div[contains(@class,"sp-message sp-message-not-found")]',
    zipcode: '',
  },
};
