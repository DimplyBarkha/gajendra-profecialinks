
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'expert',
    domain: 'expert.ie',
    loadedSelector: 'div.product-info-main',
    noResultsXPath: '//*[contains(text(), "The page you requested was not found")]',
    zipcode: '',
  },
};
