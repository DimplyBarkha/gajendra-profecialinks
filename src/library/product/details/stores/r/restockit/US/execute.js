
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'restockit',
    domain: 'restockit.com',
    loadedSelector: '.magnifier-thumb-wrapper img',
    noResultsXPath: '//div[contains(@class,"not-found__wrapper")]',
    zipcode: '',
  },
};
