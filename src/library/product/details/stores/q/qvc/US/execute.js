
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'US',
    store: 'qvc',
    domain: 'qvc.com',
    loadedSelector: 'div[class="container"]',
    noResultsXPath: '//div[@class="col-tn-12"]/ul/li | //li[@class="active"]/h1[contains(text(), "Sold Out")]',
    zipcode: '',
  },
};
