
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'HU',
    store: 'emag',
    domain: 'emag.hu',
    loadedSelector: '.page-skin-inner',
    noResultsXPath: '//div[@class="big-box err404"]',
    zipcode: '',
  },
};
