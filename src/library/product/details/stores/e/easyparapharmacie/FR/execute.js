module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'easyparapharmacie',
    domain: 'easyparapharmacie.com',
    loadedSelector: null,
    noResultsXPath: '//main[contains(@class,"main-container")]/div[@class="wrap"]/div[@class="std"]/img[@class="center"]',
    zipcode: '',
  },
};
