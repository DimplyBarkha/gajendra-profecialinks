
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'selfridges',
    domain: 'selfridges.com',
    loadedSelector: 'body',
    noResultsXPath: '//div[@class="box component section error-page-wrapper col-xs-12"]',
    zipcode: '',
  },
};
