
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AR',
    store: 'garbarino',
    domain: 'garbarino.com',
    loadedSelector: 'div[class="title-product"]',
    noResultsXPath: '//div[@id="gb-promotions-active"]',
    zipcode: '',
  },
};
