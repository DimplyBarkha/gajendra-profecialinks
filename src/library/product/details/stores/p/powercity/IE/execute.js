
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'powercity',
    domain: 'powercity.ie',
    loadedSelector: 'div.product.column1',
    noResultsXPath: '//div[@class="site-error"]',
    zipcode: '',
  },
};
