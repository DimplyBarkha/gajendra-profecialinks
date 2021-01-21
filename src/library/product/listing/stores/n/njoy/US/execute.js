
module.exports = {
  implements: 'product/listing/execute',
  parameterValues: {
    country: 'US',
    store: 'njoy',
    domain: 'shop.njoy.com',
    loadedSelector: 'div.yotpo-review-wrapper',
    noResultsXPath: null,
    gotoUrlTemplate: null,
    zipcode: '',
  },
};
