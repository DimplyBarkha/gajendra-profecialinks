
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AT',
    store: 'basler-beauty',
    domain: 'basler-beauty.at',
    loadedSelector: 'body',
    noResultsXPath: '//*[@id="wrapper"]//div[contains(@class,"err-404")]//img/@src',
    zipcode: '',
  },
};
