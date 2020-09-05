
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'shavershop',
    domain: 'shavershop.com.au',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="error-page__content"]',
    zipcode: '',
  },
};
