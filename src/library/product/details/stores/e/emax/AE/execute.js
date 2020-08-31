
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'emax',
    domain: 'emaxme.com',
    loadedSelector: 'div[class*="column main"]',
    noResultsXPath: '//h1//span[contains(text(), "404")]',
    zipcode: '',
  },
};
