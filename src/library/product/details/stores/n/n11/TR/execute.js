
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'TR',
    store: 'n11',
    domain: 'n11.com',
    loadedSelector: '.imgObj img',
    noResultsXPath: '//div[contains(@class,"error")]//p',
    zipcode: '',
  },
};
