
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IT',
    store: 'efarma',
    domain: 'efarma.com',
    loadedSelector: 'div[class="container content-main"]',
    noResultsXPath: '//div[@class="page-404"]',
    zipcode: '',
  },
};
