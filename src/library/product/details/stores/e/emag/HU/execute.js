
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'HU',
    store: 'emag',
    domain: 'emag.hu',
    loadedSelector: 'div[class="main-container-outer"]',
    noResultsXPath: '//div[@class="big-box err404"]',
    zipcode: '',
  },
};
