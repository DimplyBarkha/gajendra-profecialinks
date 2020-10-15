
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'sportsdirect',
    domain: 'sportsdirect.com',
    loadedSelector: null,
    noResultsXPath: '//div[@class="col-xs-12 ErrorHead"]/h1[contains(text(),"404")]',
    zipcode: '',
  },
};
