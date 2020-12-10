
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'RO',
    store: 'emag',
    domain: 'emag.ro',
    loadedSelector: 'div.main-container-inner',
    noResultsXPath: '//div[@class="big-box err404"]',
    zipcode: '',
  },
};
