
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'check24',
    domain: 'check24.de',
    loadedSelector: null,
    noResultsXPath: '//div[@id="error-page"] | //div[@class="fakeresult_headline"]',
    zipcode: '',
  },
};
