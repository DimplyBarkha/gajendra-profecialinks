
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'ottoversand',
    domain: 'ottoversand.at',
    loadedSelector: 'body',
    noResultsXPath: '//div[@id="error-page"]',
    zipcode: '',
  },
};
