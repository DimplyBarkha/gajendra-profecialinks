
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    domain: 'qvc.com',
    loadedSelector: 'div[id="pageContent"]',
    noResultsXPath: '//div[@class="col-tn-12"]/ul/li',
    zipcode: '',
  },
};
