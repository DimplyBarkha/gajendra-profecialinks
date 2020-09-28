
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    domain: 'myer.com.au',
    loadedSelector: "body",
    noResultsXPath: '//div[@class="error-page__containt"]',
    zipcode: '',
  },
};
