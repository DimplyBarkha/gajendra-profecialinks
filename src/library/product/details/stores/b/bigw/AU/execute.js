module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'bigw',
    domain: 'bigw.com.au',
    loadedSelector: 'div.ajaxProductDetailsPanel',
    noResultsXPath: '//div[@class="error-page__content"]',
    zipcode: '',
  },
};
