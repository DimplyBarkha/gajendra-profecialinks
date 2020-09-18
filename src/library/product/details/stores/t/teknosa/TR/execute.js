
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'TR',
    store: 'teknosa',
    domain: 'teknosa.com',
    loadedSelector: 'div[class="container"]',
    noResultsXPath: '//div[@class="alert-box alert-information"]//div[@class="text"]',
    zipcode: '',
  },
};