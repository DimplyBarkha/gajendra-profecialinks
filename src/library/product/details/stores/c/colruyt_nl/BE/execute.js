module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'colruyt_nl',
    domain: 'colruyt.be',
    loadedSelector: '#mainContent img',
    noResultsXPath: '//div[contains(@class,"no-result-page")]',
    zipcode: '',
  },
};
