
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'officedepot',
    domain: 'officedepot.com',
    loadedSelector: null,
    noResultsXPath: '//div[@id="error"] | //div[contains(@class,"no_longer_avail")]',
    zipcode: '',
  },
};
